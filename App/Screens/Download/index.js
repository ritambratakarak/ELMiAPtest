import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {useNavigation} from '@react-navigation/native';
import {Parser} from 'm3u8-parser';

// import m3u8Parser from 'm3u8-parser'

const Download = () => {
  const navigation = useNavigation();

  const fileUrl =
    'https://multiplatform-f.akamaihd.net/i/multi/april11/sintel/sintel-hd_,512x288_450_b,640x360_700_b,768x432_1000_b,1024x576_1400_m,.mp4.csmil/master.m3u8';

  const checkPermission = async () => {
    if (Platform.OS === 'ios') {
      _download();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          // downloadFile();
          _download();
          console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log('++++' + err);
      }
    }
  };

  const downloadFile = () => {
    // Get today's date to add the time suffix in filename
    let date = new Date();
    let FILE_URL = fileUrl;
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];
    const {config, fs} = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        console.log('res -> ', JSON.stringify(res));
        alert('File Downloaded Successfully.');
      });
  };

  const getFileExtention = fileUrl => {
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const downloadVideo = (fromUrl, toFile) => {
    const activeDownloads = {};
    activeDownloads[toFile] = new Promise((resolve, reject) => {
      RNFetchBlob.config({path: toFile})
        .fetch('GET', fromUrl)
        .then(res => {
          if (Math.floor(res.respInfo.status / 100) !== 2) {
            throw new Error('Failed to successfully download video');
          }
          //resolve(toFile);
          resolve(res);
        })
        .catch(err => {
          return deleteFile(toFile).then(() => reject(err));
        })
        .finally(() => {
          // cleanup
          delete activeDownloads[toFile];
        });
    });
    return activeDownloads[toFile];
  };
  const _download = async () => {
    var fs = RNFetchBlob.fs;
    var path = RNFetchBlob.fs.dirs.DownloadDir;
    var videocache = path + '/videocache';
    let isDir = await fs.isDir(videocache);
    if (!isDir) {
      await fs
        .mkdir(videocache)
        .then(() => {
          console.log('Create videocache success');
        })
        .catch(err => {
          console.log('Create videocache err');
        });
    }

    var url = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';
    // var url='http://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8'
    let dirs = videocache + '/test.m3u8';

    var dirsRes = await downloadVideo(url, dirs);
    console.log(dirsRes);
    var manifest = await dirsRes.text();
    console.log(manifest);

    //analysis m3u8
    var parser = new Parser();
    parser.push(manifest);
    parser.end();
    console.log(parser);

    var parsedManifest = parser.manifest;
    console.log(parsedManifest);

    var segments = parsedManifest.playlists;

    if (segments) {
      walk(segments, videocache);
    }
  };
  const walk = async (segments, videocache) => {
    asyncForEach(segments, async x => {
      var qianzui = 'https://bitdash-a.akamaihd.net/content/sintel/hls/';
      // var qianzui='http://devimages.apple.com/iphone/samples/bipbop/'
      // let dirs = videocache+'/'+x.uri
      let dirs = videocache + '/' + x.uri;

      let url = qianzui + x.uri;
      var res = downloadVideo(url, dirs);
    });
  };

  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  };

  const playVideo = () => {
    navigation.navigate('Player');
  };

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 25, textAlign: 'center'}}>
          React Native File Download Example
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={checkPermission}>
        <Text style={styles.text}>Download File</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={playVideo}>
        <Text style={styles.text}>Play Video</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Download;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    padding: 5,
  },
  button: {
    width: '80%',
    padding: 10,
    backgroundColor: 'blue',
    margin: 10,
  },
});

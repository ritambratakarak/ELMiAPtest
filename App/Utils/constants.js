import {Dimensions} from 'react-native';

export const FONT = {
  SIZE: {
    MINI: 12,
    SMALL: 14,
    MEDIUM: 16,
    LARGE: 18,
    BIG: 20,
    EXTRALARGE: 22,
    VERYLARGE: 25
  },
};

export const HEIGHT = Dimensions.get('window').height;
export const WIDTH = Dimensions.get('window').width;

export const COLORS = {
  PRIMARY: '#245ABE',
  SECONDARY: '#9e4831',
  WHITE: '#ffffff',
  GRAY: '#cccccc',
  DARKGRAY: '#8f8f8f',
  BLACK: '#000',
  TRANSPARENT: 'transparent',
};

export const GAP = {
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 30,
};

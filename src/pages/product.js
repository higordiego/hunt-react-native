import React from 'react';

import {WebView} from 'react-native-webview';

export default function Product({navigation}) {
  const url = navigation.getParam('url');

  return <WebView source={{uri: url}} />;
}

Product.navigationOptions = ({navigation}) => ({
  title: navigation.getParam('title'),
});

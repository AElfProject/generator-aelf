/**
 * @file entry
 */
import { ConfigProvider } from 'antd';
import moment from 'moment';
import enUS from 'antd/lib/locale/en_US';
import React from 'react';
import { render } from 'react-dom';
import App from './App';
import '../../common/index.less';

moment.locale('en-us');

render(
  <ConfigProvider locale={enUS}>
    <App />
  </ConfigProvider>,
  document.getElementById('app')
);

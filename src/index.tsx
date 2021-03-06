import React from 'react';
import { initializeWidget } from '@vikadata/widget-sdk';
import { Information } from './information';
import { Selection } from './selection';
import { Setting } from './setting';
import { Control } from './control';
import { Storage } from './storage';

const WidgetDeveloperTemplate: React.FC = () => {
  return (
    <div style={{ flexGrow: 1, overflow: 'auto', padding: '0 8px'}}>
        <Selection />
    </div>
  );
};


initializeWidget(WidgetDeveloperTemplate, process.env.WIDGET_PACKAGE_ID!);

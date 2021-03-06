import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import SliderMonitor from 'redux-slider-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

const opts = 
	{ toggleVisibilityKey:'ctrl-h'
	, changePositionKey:'ctrl-q'
	, changeMonitorKey:'ctrl-m'
	, defaultIsVisible:true
	};

export default createDevTools(
	<DockMonitor {...opts}>
		<LogMonitor />
		<SliderMonitor />
	</DockMonitor>
);
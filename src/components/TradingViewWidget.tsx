import { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  width?: string | number;
  height?: string | number;
  theme?: 'light' | 'dark';
  interval?: '1' | '5' | '15' | '30' | '60' | '240' | '1D' | '1W' | '1M';
  hideTopToolbar?: boolean;
  hideLegend?: boolean;
  hideSideToolbar?: boolean;
  allowSymbolChange?: boolean;
  saveImage?: boolean;
  details?: boolean;
  hotlist?: boolean;
  calendar?: boolean;
  studies?: string[];
  containerId?: string;
}

export const TradingViewWidget = ({
  symbol = 'BINANCE:XLMUSDT',
  width = '100%',
  height = '100%',
  theme = 'dark',
  interval = '15',
  hideTopToolbar = false,
  hideLegend = false,
  hideSideToolbar = false,
  allowSymbolChange = true,
  saveImage = false,
  details = true,
  hotlist = true,
  calendar = true,
  studies = ['Volume@tv-basicstudies'],
  containerId = 'tradingview_widget'
}: TradingViewWidgetProps) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Limpiar contenido anterior
    container.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: interval,
      timezone: 'Etc/UTC',
      theme: theme,
      style: '1',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: allowSymbolChange,
      details: details,
      hotlist: hotlist,
      calendar: calendar,
      studies: studies,
      container_id: containerId,
      hide_top_toolbar: hideTopToolbar,
      hide_legend: hideLegend,
      hide_side_toolbar: hideSideToolbar,
      save_image: saveImage,
      width: width,
      height: height,
    });

    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, theme, interval, hideTopToolbar, hideLegend, hideSideToolbar, allowSymbolChange, saveImage, details, hotlist, calendar, studies, containerId, width, height]);

  return (
    <div className="tradingview-widget-container w-full h-full">
      <div 
        ref={container} 
        id={containerId}
        className="w-full h-full"
        style={{ width, height }}
      />
    </div>
  );
};

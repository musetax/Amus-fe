import { useState } from 'react';
import { Plus, Minus, ExternalLink, Link } from 'lucide-react';

interface URLDisplayProps {
  urls: any;
  messageId: string;
}

export const URLDisplay: React.FC<URLDisplayProps> = ({ urls, messageId }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!urls || !Array.isArray(urls) || urls.length === 0) return null;

  const firstUrl = urls[0];

  return (
    <div className="mt-4 rounded-xl overflow-hidden shadow-sm" style={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      border: '1px solid #e2e8f0'
    }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4" style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <Link className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-white">Related Resources</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
          aria-label={isExpanded ? "Collapse URLs" : "Expand URLs"}
        >
          {isExpanded ? (
            <>
              <Minus className="w-3 h-3" />
              <span>Hide</span>
            </>
          ) : (
            <>
              <Plus className="w-3 h-3" />
              <span>Show All</span>
            </>
          )}
        </button>
      </div>
      
      {/* Expanded view */}
      {isExpanded && (
        <div className="p-4 space-y-3">
          {urls.map((url, index) => (
            <div
              key={`${messageId}-url-${index}`}
              className="group relative bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 text-decoration-none"
                title={url}
              >
                <div className="p-2 bg-blue-50 group-hover:bg-blue-100 rounded-lg transition-colors">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {(() => {
                      try {
                        const hostname = new URL(url).hostname;
                        return hostname.replace('www.', '');
                      } catch {
                        return url;
                      }
                    })()}
                  </div>
                  <div className="text-xs text-gray-500 truncate mt-1" style={{    wordBreak: "break-word"}}>
                    {url}
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </div>
              </a>
            </div>
          ))}
          {urls.length > 1 && (
            <div className="text-center py-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                <Link className="w-3 h-3" />
                {urls.length} resource{urls.length > 1 ? 's' : ''} found
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Collapsed view */}
      {!isExpanded && (
        <div className="p-4">
          <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 group">
            <a
              href={firstUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 text-decoration-none"
              title={firstUrl}
            >
              <div className="p-2 bg-blue-50 group-hover:bg-blue-100 rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {(() => {
                    try {
                      const hostname = new URL(firstUrl).hostname;
                      return hostname.replace('www.', '');
                    } catch {
                      return firstUrl;
                    }
                  })()}
                </div>
                <div className="text-xs text-gray-500 truncate mt-1" style={{    wordBreak: "break-word"}}>
                  {firstUrl}
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </div>
            </a>
          </div>
          {urls.length > 1 && (
            <div className="text-center mt-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                <Plus className="w-3 h-3" />
                {urls.length - 1} more resource{urls.length - 1 > 1 ? 's' : ''} available
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
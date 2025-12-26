
import React from 'react';

interface AdBannerProps {
  position: 'top' | 'bottom' | 'center';
}

const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  // In a real implementation, we would use dangerouslySetInnerHTML for the provided scripts.
  // For safety and compatibility in this demo, we'll use a visual placeholder that mimics the ad dimensions.
  
  const styles = {
    top: 'h-[60px] w-full max-w-[468px] bg-gray-900 border border-white/5 flex items-center justify-center overflow-hidden',
    bottom: 'h-[60px] w-full max-w-[468px] bg-gray-900 border border-white/5 flex items-center justify-center overflow-hidden',
    center: 'h-[300px] w-[160px] bg-gray-900 border border-white/5 flex items-center justify-center overflow-hidden mx-auto rounded-xl'
  };

  return (
    <div className={styles[position]}>
      <div className="text-center">
        <p className="text-[8px] uppercase tracking-widest text-gray-600">Sponsor Ad</p>
        <div className="mt-1 flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded bg-blue-500/20"></div>
            <p className="text-[10px] font-mono font-bold text-gray-400">
                {position === 'center' ? 'AD_01E7B' : 'AD_B78E9'}
            </p>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;

import React from 'react';
import { ThreeDIcon } from './ThreeDIcon';

interface HealthAdvisoryCardProps {
  aqi: number;
  category: string;
}

export const HealthAdvisoryCard: React.FC<HealthAdvisoryCardProps> = ({
  aqi,
  category
}) => {
  const getAdvisories = () => {
    if (aqi <= 50) {
      return {
        mask: {
          title: 'No Mask Required',
          desc: 'Air quality is pristine. Ideal for all outdoor activities.',
          status: 'safe'
        },
        exercise: {
          title: 'Ideal for Outdoor Fitness',
          desc: 'Safe for jogging, cycling, and vigorous outdoor sports.',
          status: 'safe'
        },
        home: {
          title: 'Open Windows & Ventilate',
          desc: 'Allow natural fresh air into your home or office.',
          status: 'safe'
        },
        sensitive: {
          title: 'Minimal Impact',
          desc: 'Zero risk for children, elderly, and individuals with asthma.',
          status: 'safe'
        }
      };
    } else if (aqi <= 100) {
      return {
        mask: {
          title: 'Mask Optional',
          desc: 'Comfortable air quality for the vast majority of citizens.',
          status: 'safe'
        },
        exercise: {
          title: 'Normal Outdoor Exercise',
          desc: 'Good for daily commute, walks, and athletic routines.',
          status: 'safe'
        },
        home: {
          title: 'Normal Ventilation',
          desc: 'Standard ventilation is safe throughout the day.',
          status: 'safe'
        },
        sensitive: {
          title: 'Minor Breathing Discomfort',
          desc: 'Sensitive individuals may experience slight respiratory irritation.',
          status: 'warning'
        }
      };
    } else if (aqi <= 200) {
      return {
        mask: {
          title: 'Mask Recommended',
          desc: 'Sensitive people should wear a protective mask near heavy traffic.',
          status: 'warning'
        },
        exercise: {
          title: 'Reduce Heavy Exertion',
          desc: 'Avoid strenuous high-intensity outdoor workouts during rush hours.',
          status: 'warning'
        },
        home: {
          title: 'Limit Direct Street Air',
          desc: 'Close windows facing busy roads during peak morning & evening hours.',
          status: 'warning'
        },
        sensitive: {
          title: 'Elevated Asthma Risk',
          desc: 'Children and asthma patients should keep inhalers accessible.',
          status: 'danger'
        }
      };
    } else if (aqi <= 300) {
      return {
        mask: {
          title: 'N95 Respirator Advised',
          desc: 'Wear an N95 or particulate respirator when stepping outdoors.',
          status: 'danger'
        },
        exercise: {
          title: 'Avoid Outdoor Running',
          desc: 'Shift cardio workouts and physical training indoors.',
          status: 'danger'
        },
        home: {
          title: 'Run Indoor Air Purifiers',
          desc: 'Keep windows sealed; operate HEPA air filtration if available.',
          status: 'danger'
        },
        sensitive: {
          title: 'Serious Discomfort',
          desc: 'Prolonged outdoor exposure may trigger severe bronchial spasms.',
          status: 'critical'
        }
      };
    } else {
      // 301 - 500+ (Very Poor & Severe)
      return {
        mask: {
          title: 'Mandatory N95 / FFP2',
          desc: 'Strictly wear certified N95 masks; avoid any outdoor air inhalation.',
          status: 'critical'
        },
        exercise: {
          title: 'Zero Outdoor Activities',
          desc: 'Cancel all outdoor jogging, sports, and unnecessary commutes.',
          status: 'critical'
        },
        home: {
          title: 'Strict Window Sealing',
          desc: 'Keep all windows tightly closed. Run HEPA purifiers continuously.',
          status: 'critical'
        },
        sensitive: {
          title: 'Critical Health Hazard',
          desc: 'Serious respiratory risk for everyone. Elderly and children must stay indoors.',
          status: 'critical'
        }
      };
    }
  };

  const adv = getAdvisories();

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'safe':
        return 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400';
      case 'warning':
        return 'border-amber-500/30 bg-amber-950/20 text-amber-400';
      case 'danger':
        return 'border-rose-500/30 bg-rose-950/20 text-rose-400';
      case 'critical':
      default:
        return 'border-red-600/40 bg-red-950/30 text-red-400';
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ThreeDIcon name="lungs" size="sm" />
            Citizen Health & Daily Living Advisories
          </h3>
          <p className="text-xs text-slate-400">
            Actionable protective measures tailored for current air quality ({category})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Mask */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${getBorderColor(adv.mask.status)}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Respiratory Protection
            </span>
            <ThreeDIcon name="mask" size="sm" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">{adv.mask.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{adv.mask.desc}</p>
          </div>
        </div>

        {/* 2. Fitness */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${getBorderColor(adv.exercise.status)}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Outdoor Exercise
            </span>
            <ThreeDIcon name="runner" size="sm" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">{adv.exercise.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{adv.exercise.desc}</p>
          </div>
        </div>

        {/* 3. Home */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${getBorderColor(adv.home.status)}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Home & Indoors
            </span>
            <ThreeDIcon name="home" size="sm" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">{adv.home.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{adv.home.desc}</p>
          </div>
        </div>

        {/* 4. Sensitive */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${getBorderColor(adv.sensitive.status)}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Sensitive Groups
            </span>
            <ThreeDIcon name="lungs" size="sm" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">{adv.sensitive.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{adv.sensitive.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

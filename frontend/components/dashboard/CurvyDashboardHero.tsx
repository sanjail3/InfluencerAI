import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const SparkleElement = ({ delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      rotate: [0, 180]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
    className={className}
  >
    <Sparkles className="text-pink-200" size={16} />
  </motion.div>
);

const Sprinkle = ({ delay = 0, className = "" }) => (
  <motion.div
    className={`absolute h-1 w-1 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 ${className}`}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
  />
);

const CurvedDashboardHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="w-full p-4">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600 shadow-xl">
        {/* Decorative elements */}
        <SparkleElement className="absolute left-12 top-12" delay={0} />
        <SparkleElement className="absolute right-16 top-24" delay={0.5} />
        <SparkleElement className="absolute bottom-16 left-24" delay={1} />
        <SparkleElement className="absolute bottom-24 right-12" delay={1.5} />
        
        {/* Sprinkles */}
        <Sprinkle className="left-1/4 top-1/3" delay={0.2} />
        <Sprinkle className="right-1/3 top-1/4" delay={0.4} />
        <Sprinkle className="bottom-1/3 left-1/3" delay={0.6} />
        <Sprinkle className="bottom-1/4 right-1/4" delay={0.8} />
        <Sprinkle className="left-1/2 top-1/2" delay={1.0} />

        {/* Curved top edge */}
        <div className="absolute inset-x-0 top-0 h-16 bg-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600" 
               style={{
                 borderRadius: '100% 100% 0 0',
                 transform: 'translateY(-50%)',
               }}
          />
        </div>

        {/* Background effects */}
        <div className="absolute left-1/4 top-1/4 h-48 w-48 animate-pulse rounded-full bg-purple-400/20 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 h-48 w-48 animate-pulse rounded-full bg-pink-400/20 blur-3xl" />

        {/* Content container */}
        <div className="relative z-10 flex flex-col items-center px-6 py-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
          >
            <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                 Your brand's storytelling, simplified!
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6 max-w-xl text-base text-purple-100 md:text-lg"
          >
           Boost your brand’s impact and build lasting trust!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative"
          >
            <Button className="rounded-full bg-gradient-to-r from-[#d550ac] to-[#7773FA]  px-6 py-2 text-base font-semibold text-white hover:from-purple-600 hover:to-pink-600">
              Try Video Ads
            </Button>
            <SparkleElement className="absolute -right-6 -top-6" delay={2} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 grid grid-cols-4 gap-4 md:grid-cols-7"
          >
            {[
        
              { icon: "📈", label: "AI Content analyser" },
              { icon: "🎥", label: "AI Short Engine" },
              { icon: "🎬", label: "AI Video Ads" },
              { icon: "🤖", label: "Content Researcher Agent" },
              { icon: "🚀", label: "Automatic Content poster" },
              { icon: "✨", label: "More" }
            ].map((feature, index) => (
              <div key={index} className="relative flex flex-col items-center gap-1 text-white">
                <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm">
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <span className="text-xs font-medium">{feature.label}</span>
                {index % 2 === 0 && <SparkleElement className="absolute -right-2 top-0" delay={index * 0.3} />}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Curved bottom edge */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600"
               style={{
                 borderRadius: '0 0 100% 100%',
                 transform: 'translateY(50%)',
               }}
          />
        </div>
      </div>
    </div>
  );
};

export default CurvedDashboardHero;
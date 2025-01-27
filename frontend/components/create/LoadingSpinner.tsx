"use client";

export function LoadingSpinner({text}: {text?: string}) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-[#d550ac] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
      </div>
      <p className="ml-4 text-xl font-medium text-purple-200">{text ? text : 'Analyzing product...'}</p>
    </div>
  );
}
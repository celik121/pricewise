"use client";

import { scrapeAndStoreProduct } from '@/lib/actions';
import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (
      hostname.includes('amazon.com') || 
      hostname.includes('amazon.') || 
      hostname.endsWith('amazon')
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
};

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // Keep track of focus state

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission (page reload)

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    if (!isValidLink) return alert('Please provide a valid Amazon link');

    try {
      setIsLoading(true);
      const product = await scrapeAndStoreProduct(searchPrompt);
      setIsFocused(true); // Keep focus after submission
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setIsFocused(false); // Go back to original state
  };

  const handleFocusWithDelay = () => {
    setTimeout(() => {
      setIsFocused(true); // Apply focus after the delay
    }, 200); // Delay cursor focus by 200ms
  };

  return (
    <>
      {/* Overlay: Covers the background when search is focused */}
      {isFocused && (
        <div className="fixed inset-0 bg-black opacity-100 z-10"></div>
      )}

      <motion.div
        initial={{ y: 0 }}
        animate={isFocused ? { y: -150 } : { y: 0 }} // Transition up when focused
        transition={{ type: 'tween', duration: 0.1 }} // Smooth transition
        className="relative z-20"
      >
        {/* Back Button */}
        {isFocused && (
          <button 
            onClick={handleBack} 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30"
          >
            <Image src="/assets/icons/back.svg" alt="Back" width={20} height={20} />
          </button>
        )}

        {/* Search Bar */}
        <form 
          className="flex items-center justify-center mt-12 relative w-full" 
          onSubmit={handleSubmit}
        >
          {/* Search Icon */}
          {!isFocused && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Image src="/assets/icons/next.svg" alt="Search" width={20} height={20} />
            </div>
          )}

          {/* Input Field with delayed focus */}
          <input 
            type="text"
            value={searchPrompt}
            onFocus={handleFocusWithDelay} // Delay the focus by 200ms
            onChange={(e) => setSearchPrompt(e.target.value)}
            placeholder="Search"
            className="pl-12 pr-4 py-2 w-full rounded-full border border-white focus:outline-none text-white bg-black placeholder-white"
          />

          {/* Submit Button */}
          <button 
            type="submit" 
            className="hidden"
            disabled={searchPrompt === ''}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </motion.div>
    </>
  );
};

export default Searchbar;

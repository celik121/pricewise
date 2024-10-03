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
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    if (!isValidLink) return alert('Please provide a valid Amazon link');

    try {
      setIsLoading(true);
      const product = await scrapeAndStoreProduct(searchPrompt);
      setIsFocused(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setIsFocused(false);
  };

  const handleFocusWithDelay = () => {
    setTimeout(() => {
      setIsFocused(true);
    }, 500); // Delays the focus effect by 0.5 seconds
  };

  return (
    <>
      {isFocused && (
        <div className="fixed inset-0 bg-black opacity-100 z-10"></div>
      )}

      <motion.div
        initial={{ y: 0 }}
        animate={isFocused ? { y: -150 } : { y: 0 }}
        transition={{ type: 'tween', duration: 0.1 }}
        className="relative z-20"
      >
        {isFocused && (
          <button 
            onClick={handleBack} 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30"
          >
            <Image src="/assets/icons/back.svg" alt="Back" width={20} height={20} />
          </button>
        )}

        <form 
          className="flex items-center justify-center mt-12 relative w-full" 
          onSubmit={handleSubmit}
        >
          {!isFocused && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Image src="/assets/icons/next.svg" alt="Search" width={20} height={20} />
            </div>
          )}

          {/* Adding onFocus with delay */}
          <input 
            type="text"
            value={searchPrompt}
            onFocus={handleFocusWithDelay} // Adding a 0.5s delay before setting focus
            onChange={(e) => setSearchPrompt(e.target.value)}
            placeholder="Search"
            className="pl-12 pr-4 py-2 w-full rounded-full border border-white focus:outline-none text-white bg-black placeholder-white"
          />

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

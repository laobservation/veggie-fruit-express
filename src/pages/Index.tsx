
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from './HomePage';
import { Home, Heart, ShoppingCart, Wallet, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto">
          <HomePage />
        </div>
      </main>
      
      {/* Side Navigation (Desktop) */}
      <div className="hidden md:block fixed left-4 top-1/2 transform -translate-y-1/2 z-10">
        <div className="bg-white p-2 rounded-full shadow-md flex flex-col items-center space-y-6">
          <Link to="/" className="p-2 rounded-full bg-green-50 text-green-600">
            <Home size={20} />
          </Link>
          <Link to="/" className="p-2 text-gray-400 hover:text-gray-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H20V7H4V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 10H20V14H4V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 17H20V20H4V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link to="/" className="p-2 text-gray-400 hover:text-gray-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M9 10L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M9 14L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
          <Link to="/profile" className="p-2 text-gray-400 hover:text-gray-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
              <path d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20" stroke="currentColor" strokeWidth="2" />
            </svg>
          </Link>
          <Link to="/settings" className="p-2 text-gray-400 hover:text-gray-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" />
              <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.287 15.9606C19.3467 16.285 19.5043 16.5843 19.73 16.82L19.79 16.88C19.976 17.066 20.1235 17.2857 20.2241 17.5291C20.3248 17.7726 20.3766 18.0344 20.3766 18.299C20.3766 18.5636 20.3248 18.8254 20.2241 19.0689C20.1235 19.3123 19.976 19.532 19.79 19.718C19.604 19.904 19.3843 20.0515 19.1409 20.1522C18.8974 20.2528 18.6356 20.3046 18.371 20.3046C18.1064 20.3046 17.8446 20.2528 17.6011 20.1522C17.3577 20.0515 17.138 19.904 16.952 19.718L16.892 19.658C16.6563 19.4323 16.357 19.2747 16.0326 19.215C15.7082 19.1552 15.3736 19.1949 15.072 19.328C14.7767 19.4544 14.532 19.6735 14.3787 19.9563C14.2254 20.2392 14.1721 20.5696 14.23 20.892V21C14.23 21.5304 14.0193 22.0391 13.6442 22.4142C13.2691 22.7893 12.7604 23 12.23 23C11.6996 23 11.1909 22.7893 10.8158 22.4142C10.4407 22.0391 10.23 21.5304 10.23 21V20.908C10.2879 20.5856 10.2346 20.2552 10.0813 19.9723C9.92799 19.6895 9.68334 19.4704 9.38799 19.344C9.08637 19.2109 8.75176 19.1712 8.42731 19.231C8.10285 19.2907 7.80358 19.4483 7.56799 19.674L7.50799 19.734C7.32198 19.92 7.10231 20.0675 6.85887 20.1682C6.61544 20.2688 6.35363 20.3206 6.08899 20.3206C5.82436 20.3206 5.56255 20.2688 5.31911 20.1682C5.07568 20.0675 4.85601 19.92 4.66999 19.734C4.48397 19.548 4.33647 19.3283 4.23583 19.0849C4.13519 18.8414 4.08335 18.5796 4.08335 18.315C4.08335 18.0504 4.13519 17.7886 4.23583 17.5451C4.33647 17.3017 4.48397 17.082 4.66999 16.896L4.72999 16.836C4.95656 16.6004 5.11416 16.3011 5.17393 15.9767C5.2337 15.6523 5.19401 15.3177 5.06099 15.016C4.93456 14.7213 4.71534 14.4774 4.43342 14.3245C4.1515 14.1717 3.82207 14.1185 3.49999 14.176H3.49999C2.96955 14.176 2.46086 13.9653 2.08579 13.5902C1.71071 13.2152 1.49999 12.7065 1.49999 12.176C1.49999 11.6456 1.71071 11.1369 2.08579 10.7618C2.46086 10.3867 2.96955 10.176 3.49999 10.176H3.59199C3.9144 10.118 4.2448 10.0647 4.5277 9.91143C4.81059 9.75811 5.02981 9.51346 5.15599 9.218C5.28901 8.91639 5.3287 8.58178 5.26893 8.25732C5.20916 7.93287 5.05156 7.6336 4.82499 7.398L4.76499 7.338C4.57896 7.15198 4.43147 6.93231 4.33083 6.68888C4.23019 6.44544 4.17835 6.18363 4.17835 5.919C4.17835 5.65436 4.23019 5.39255 4.33083 5.14911C4.43147 4.90568 4.57896 4.68601 4.76499 4.5C4.95101 4.31398 5.17067 4.16648 5.41411 4.06584C5.65755 3.9652 5.91935 3.91336 6.18399 3.91336C6.44863 3.91336 6.71043 3.9652 6.95387 4.06584C7.19731 4.16648 7.41697 4.31398 7.60299 4.5L7.66299 4.56C7.89857 4.78657 8.19784 4.94416 8.5223 5.00393C8.84675 5.0637 9.18137 5.02401 9.48299 4.891H9.49999C9.79534 4.76456 10.0391 4.54535 10.192 4.26343C10.3448 3.98151 10.398 3.65208 10.34 3.33V3.33C10.34 2.79957 10.5507 2.29086 10.9258 1.91579C11.3009 1.54072 11.8096 1.33 12.34 1.33C12.8704 1.33 13.3791 1.54072 13.7542 1.91579C14.1293 2.29086 14.34 2.79957 14.34 3.33V3.422C14.2821 3.7444 14.3354 4.07479 14.4887 4.35769C14.642 4.64058 14.8867 4.8598 15.182 4.986C15.4836 5.11901 15.8182 5.1587 16.1427 5.09893C16.4671 5.03916 16.7664 4.88157 17.002 4.655L17.062 4.595C17.248 4.40898 17.4677 4.26148 17.7111 4.16084C17.9546 4.06021 18.2164 4.00836 18.481 4.00836C18.7456 4.00836 19.0074 4.06021 19.2509 4.16084C19.4943 4.26148 19.714 4.40898 19.9 4.595C20.086 4.78101 20.2335 5.00067 20.3342 5.24411C20.4348 5.48755 20.4866 5.74936 20.4866 6.014C20.4866 6.27863 20.4348 6.54044 20.3342 6.78388C20.2335 7.02732 20.086 7.24698 19.9 7.433L19.84 7.493C19.6134 7.72858 19.4558 8.02784 19.3961 8.3523C19.3363 8.67676 19.376 9.01137 19.509 9.313V9.33C19.6354 9.62535 19.8546 9.87001 20.1365 10.0233C20.4185 10.1766 20.7479 10.2298 21.07 10.172H21.07C21.6004 10.172 22.1091 10.3827 22.4842 10.7578C22.8593 11.1329 23.07 11.6416 23.07 12.172C23.07 12.7024 22.8593 13.2111 22.4842 13.5862C22.1091 13.9612 21.6004 14.172 21.07 14.172H20.978C20.6556 14.2299 20.3252 14.2832 20.0423 14.4365C19.7594 14.5898 19.5402 14.8345 19.414 15.13L19.4 15.13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link to="/support" className="p-2 text-gray-400 hover:text-gray-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 18.72C17.34 18.38 16.4 18 15 18C13.6 18 12.66 18.38 12 18.72M21 19L17 21V17L21 19ZM3 19L7 21V17L3 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 17.5C15.866 17.5 19 14.366 19 10.5C19 6.63401 15.866 3.5 12 3.5C8.13401 3.5 5 6.63401 5 10.5C5 14.366 8.13401 17.5 12 17.5Z" stroke="currentColor" strokeWidth="2" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation - Only shown on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-top flex justify-around py-2 border-t">
        <Link to="/" className="flex flex-col items-center p-2">
          <Home className="h-5 w-5 text-green-500" />
          <span className="text-xs text-gray-600 mt-1">Home</span>
        </Link>
        <Link to="/favorites" className="flex flex-col items-center p-2">
          <Heart className="h-5 w-5 text-gray-500" />
          <span className="text-xs text-gray-600 mt-1">Favorites</span>
        </Link>
        <Link to="/cart" className="flex flex-col items-center p-2">
          <ShoppingCart className="h-5 w-5 text-gray-500" />
          <span className="text-xs text-gray-600 mt-1">Cart</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center p-2">
          <Wallet className="h-5 w-5 text-gray-500" />
          <span className="text-xs text-gray-600 mt-1">Wallet</span>
        </Link>
        <Link to="/settings" className="flex flex-col items-center p-2">
          <Settings className="h-5 w-5 text-gray-500" />
          <span className="text-xs text-gray-600 mt-1">Profile</span>
        </Link>
      </div>
      
      {/* Desktop Footer - Only shown on desktop */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default Index;

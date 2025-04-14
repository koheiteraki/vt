'use client';


import React from "react";
import { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import styles from "./Header.module.scss";



export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
  // クリック時に `isOpen` をリセットする関数
  const handleLinkClick = () => {
    setIsOpen(false);
  };
  
    const toggleMenu = () => {
      setIsOpen((prev) => !prev);
    };

    return <header className={styles.header}>
        <div className={styles.header_inner}>
            <div className={styles.header_bar}>
                <div className={styles.header_logo}>
                    <Link href='/'>
                    <Image className={styles.img} src="https://placehold.jp/150x50.png" alt="logo" width={400} height={400} />
                    </Link>
                </div>
                <button id="js-header_hum" className={styles.header_hum} aria-label="Menu Open" aria-expanded={isOpen} onClick={toggleMenu} aria-controls="header__panel">
                <span className={styles.header_hum_line}>&nbsp;</span>
                <span className={styles.header_hum_line}>&nbsp;</span>
                <span className={styles.header_hum_line}>&nbsp;</span>
                </button>
                
            {/* クラスのトグルを適用 */}
            <nav className={`${styles.header_nav} ${isOpen ? styles.is_open : ""}`}>
                    <ul className={styles.header_nav_list}>
                    <li>
                        <Link onClick={handleLinkClick} href={'#'}>PRODUCTS</Link>
                    </li>
                    <li>
                        <Link onClick={handleLinkClick} href={'#'}>ABOUT</Link>
                    </li>
                    <li>
                        <Link onClick={handleLinkClick} href={'#'}>COMPANY</Link>
                    </li>
                    <li>
                        <Link onClick={handleLinkClick} href={'#'}>CONTACT</Link>
                    </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>;
}

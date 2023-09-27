import React from 'react';
import logo from '../../images/timeSmartAILogo.png';

import styles from './index.module.scss';

export default function LoadingScreen({ subsequentLoad = false, text }) {
  return (
    <div
      className={`${subsequentLoad ? styles.loadingScreenInline : styles.loadingScreen} ${text ? styles.inline : ''}`}>
      <div className={`${styles.loadingScreenInline} ${styles.displayInColumn}`}>
        <div className={styles.fadeIn}>
          <img src={logo} alt="" className={styles.logo} />
        </div>
        <br />
        {!subsequentLoad && (
          <div className={styles.rotating_text}>
            {text?.map(message => (
              <span key={message}>{message}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import type { IconType } from 'react-icons';
import { FaCheck, FaCreditCard, FaShieldAlt, FaUser, FaUserFriends } from 'react-icons/fa';
import styles from './CheckoutStepper.module.css';

export const CHECKOUT_STEP_COUNT = 5;

const STEPS: { lines: [string, string]; Icon: IconType }[] = [
  { lines: ['eKYC', 'Verification'], Icon: FaShieldAlt },
  { lines: ['Personal', 'Details'], Icon: FaUser },
  { lines: ['Family &', 'Nominee'], Icon: FaUserFriends },
  { lines: ['Payment', ''], Icon: FaCreditCard },
  { lines: ['Confirmation', ''], Icon: FaCheck },
];

export interface CheckoutStepperProps {
  currentStep: number;
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <nav className={styles.stepper} aria-label="Checkout progress">
      <div className={styles.track}>
        {STEPS.map((step, index) => {
          const done = index < currentStep;
          const active = index === currentStep;
          const Icon = step.Icon;
          const iconClass = done
            ? styles.iconDone
            : active
              ? styles.iconActive
              : styles.iconUpcoming;
          const labelClass =
            styles.labelWrap + ' ' + (done ? styles.labelDone : active ? styles.labelActive : '');

          return (
            <div key={`${step.lines[0]}-${index}`} className={styles.segment}>
              {index > 0 && (
                <div
                  className={`${styles.connector} ${currentStep >= index ? styles.connectorDone : ''}`}
                  aria-hidden
                />
              )}
              <div className={styles.unit}>
                <div className={`${styles.iconCircle} ${iconClass}`} aria-current={active ? 'step' : undefined}>
                  {done ? <FaCheck aria-hidden /> : <Icon aria-hidden />}
                </div>
                <div className={labelClass}>
                  <span className={styles.labelLine}>{step.lines[0]}</span>
                  {step.lines[1] ? <span className={styles.labelLine}>{step.lines[1]}</span> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

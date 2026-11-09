import { PhoneIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="disclaimer">
          <strong>Medical disclaimer.</strong> BabyGuide summarizes only the pediatric guidance
          in its library. It is not a diagnosis and is not a substitute for your pediatrician's
          care. If you are worried about your child, call your doctor.
        </p>
        <p className="emergency">
          <PhoneIcon size={18} />
          Emergencies: call <a href="tel:911">911</a>
        </p>
      </div>
    </footer>
  );
}

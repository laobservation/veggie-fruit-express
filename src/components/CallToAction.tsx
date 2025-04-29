
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="bg-veggie-primary text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Fresh Produce at Your Doorstep</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Get farm-fresh fruits and vegetables delivered to your home with our convenient cash on delivery service.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-veggie-primary">
            <Link to="/fruits">Shop Fruits</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-veggie-primary">
            <Link to="/vegetables">Shop Vegetables</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

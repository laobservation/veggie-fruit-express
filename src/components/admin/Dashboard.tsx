
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid3X3, LayoutDashboard, Package2, Settings, ShoppingBag, SlidersHorizontal, Users, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Produits',
    description: 'Gérez l\'inventaire des produits, les prix et la visibilité',
    icon: Package2,
    href: '#products' // Anchor to products section on same page
  },
  {
    title: 'Commandes',
    description: 'Gérez les commandes des clients et le statut de livraison',
    icon: ShoppingBag,
    href: '#orders' // Anchor to orders section on same page
  },
  {
    title: 'Clients',
    description: 'Consultez et gérez les informations des clients',
    icon: Users,
    href: '#customers' // Anchor to customers section on same page
  },
  {
    title: 'Slider',
    description: 'Gérez les images et le contenu du slider de la page d\'accueil',
    icon: SlidersHorizontal,
    href: '/admin/slider'
  },
  {
    title: 'Traductions',
    description: 'Gérez les textes et traductions du site',
    icon: Globe,
    href: '/admin/translations'
  },
  {
    title: 'Paramètres',
    description: 'Configurez les paramètres du site et les options',
    icon: Settings,
    href: '/admin/settings'
  }
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Tableau de Bord</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link 
            to={feature.href.startsWith('#') ? feature.href : feature.href} 
            key={feature.title}
            className={`transition-transform duration-200 hover:scale-105 ${!feature.href.startsWith('#') ? '' : 'pointer-events-none'}`}
          >
            <Card className="h-full">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-veggie-primary mb-2" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

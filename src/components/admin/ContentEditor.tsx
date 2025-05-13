import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type ContentSection = {
  id: string;
  title: string;
  elements: ContentElement[];
};

type ContentElement = {
  id: string;
  type: 'heading' | 'paragraph' | 'button';
  value: string;
  path: string;
};

const ContentEditor: React.FC = () => {
  
  const initialSections: ContentSection[] = [
    {
      id: 'home',
      title: 'Page d\'Accueil',
      elements: [
        {
          id: 'welcome-heading',
          type: 'heading',
          value: 'Bienvenue à Notre Marché Bio',
          path: 'HomePage -> Welcome Card -> Heading'
        },
        {
          id: 'welcome-paragraph',
          type: 'paragraph',
          value: 'Découvrez notre sélection de fruits et légumes frais, cultivés localement et livrés directement chez vous. Nous sommes fiers de vous offrir des produits de qualité supérieure pour votre santé.',
          path: 'HomePage -> Welcome Card -> Paragraph'
        },
        {
          id: 'featured-products-title',
          type: 'heading',
          value: 'Produits Vedettes',
          path: 'HomePage -> Featured Products -> Title'
        }
      ]
    },
    {
      id: 'header',
      title: 'En-tête',
      elements: [
        {
          id: 'site-title',
          type: 'heading',
          value: 'Marché Bio',
          path: 'Header -> Site Title'
        },
        {
          id: 'nav-home',
          type: 'button',
          value: 'Accueil',
          path: 'Header -> Navigation -> Home'
        },
        {
          id: 'nav-fruits',
          type: 'button',
          value: 'Fruits',
          path: 'Header -> Navigation -> Fruits'
        },
        {
          id: 'nav-vegetables',
          type: 'button',
          value: 'Légumes',
          path: 'Header -> Navigation -> Vegetables'
        }
      ]
    },
    {
      id: 'product',
      title: 'Page Produit',
      elements: [
        {
          id: 'product-description-title',
          type: 'heading',
          value: 'Description',
          path: 'ProductPage -> Description -> Title'
        },
        {
          id: 'product-cta-button',
          type: 'button',
          value: 'Ajouter au Panier',
          path: 'ProductPage -> CTA -> Button'
        }
      ]
    }
  ];
  
  const [sections, setSections] = useState<ContentSection[]>(initialSections);
  const [editedElement, setEditedElement] = useState<ContentElement | null>(null);
  
  const handleEdit = (sectionId: string, elementId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const element = section.elements.find(e => e.id === elementId);
    if (!element) return;
    
    setEditedElement({...element});
  };
  
  const handleSave = (sectionId: string, elementId: string) => {
    if (!editedElement) return;
    
    const updatedSections = sections.map(section => {
      if (section.id !== sectionId) return section;
      
      return {
        ...section,
        elements: section.elements.map(element => {
          if (element.id !== elementId) return element;
          return {...editedElement};
        })
      };
    });
    
    setSections(updatedSections);
    setEditedElement(null);
    
    toast.success("Modification enregistrée", {
      description: "Le contenu a été mis à jour avec succès."
    });
  };
  
  const handleCancel = () => {
    setEditedElement(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedElement) return;
    
    setEditedElement({
      ...editedElement,
      value: e.target.value
    });
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Éditeur de Contenu</h2>
      
      <Accordion type="single" collapsible className="w-full">
        {sections.map(section => (
          <AccordionItem key={section.id} value={section.id}>
            <AccordionTrigger className="hover:bg-gray-50 px-4">
              {section.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-2">
                {section.elements.map(element => (
                  <div key={element.id} className="border rounded-md p-4 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">{element.path}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                        {element.type === 'heading' ? 'Titre' : 
                         element.type === 'paragraph' ? 'Paragraphe' : 'Bouton'}
                      </span>
                    </div>
                    
                    {editedElement && editedElement.id === element.id ? (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`edit-${element.id}`}>
                            Modifier {element.type === 'heading' ? 'le titre' : 
                                     element.type === 'paragraph' ? 'le paragraphe' : 'le texte du bouton'}
                          </Label>
                          {element.type === 'paragraph' ? (
                            <Textarea 
                              id={`edit-${element.id}`}
                              value={editedElement.value}
                              onChange={handleInputChange}
                              className="mt-1"
                              rows={4}
                            />
                          ) : (
                            <Input 
                              id={`edit-${element.id}`}
                              value={editedElement.value}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          )}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleCancel}
                          >
                            Annuler
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleSave(section.id, element.id)}
                          >
                            Enregistrer
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-2">
                          {element.type === 'heading' ? (
                            <h3 className="font-medium">{element.value}</h3>
                          ) : element.type === 'paragraph' ? (
                            <p className="text-sm text-gray-700">{element.value}</p>
                          ) : (
                            <div className="inline-block bg-veggie-primary text-white text-sm px-3 py-1 rounded-md">
                              {element.value}
                            </div>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(section.id, element.id)}
                        >
                          Modifier
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ContentEditor;

import React from 'react';
import { Instagram } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer id="redes-sociais" className="px-6 md:px-12 lg:px-24 py-16 bg-transparent border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 font-light relative z-10">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
        <span className="font-medium text-white text-lg">Seu Negócio.</span>
        <span>© {currentYear} Todos os direitos reservados.</span>
      </div>
      
      <div className="my-6 md:my-0 flex gap-6">
        <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
        <a href="#" className="hover:text-white transition-colors">Privacidade</a>
      </div>
      
      <div className="flex items-center gap-6">
        <a 
          href="https://www.instagram.com/harpia.ctv/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-pink-500 transition-colors"
          title="Instagram"
        >
          <Instagram size={20} />
        </a>
        <a 
          href="mailto:ola@site.com" 
          className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
        >
          Fale conosco
        </a>
      </div>
    </footer>
  );
}

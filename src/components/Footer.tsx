const footerLinks = {
  Produto: ["Editor de PDF", "Assinatura Digital", "API", "Integracoes"],
  Empresa: ["Sobre", "Blog", "Carreiras", "Contato"],
  Legal: ["Termos de Uso", "Privacidade", "Cookies"],
};

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <span className="font-display text-xl font-extrabold text-foreground tracking-tight">
            Quillr
          </span>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            A maneira mais rapida de editar PDFs diretamente no navegador.
          </p>
        </div>
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category}>
            <h4 className="font-bold text-foreground text-sm mb-4">{category}</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">
          2024 Quillr. Todos os direitos reservados.
        </p>
        <p className="text-sm text-muted-foreground">
          Processamento seguro SSL
        </p>
      </div>
    </footer>
  );
};

export default Footer;

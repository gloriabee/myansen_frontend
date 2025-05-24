

interface FooterProps{
    year: number;
    companyName: string;
    label?: string;
    link?: string;
}

const Footer = ({ year, companyName, label,link }: FooterProps) => {
    
    return (
      <>
        <footer className="bg-teal-700 p-4 shadow-md rounded-bl-lg rounded-br-lg sm:footer-horizontal
        mb-6">
          <div className="container mx-auto text-center text-white">
            <p className="text-sm">
              &copy;{year}
              {link ? (
                <a href={link} className="text-sm">
                  {" "}
                  {companyName}.
                </a>
              ) : (
                <span className="mx-2">{companyName}.</span>
              )}
              All rights reserved.
            </p>
            <a href="#" className="text-sm text-teal-200 hover:underline">
              {label}
            </a>
          </div>
        </footer>
      </>
    );
    
}
export default Footer;
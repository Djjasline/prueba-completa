import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const BreadcrumbNavigation = () => {
  const location = useLocation();

  const breadcrumbItems = [
    {
      label: 'Inicio',
      path: '/',
      icon: 'Home'
    },
    {
      label: 'Crear Reporte',
      path: '/service-report-creation',
      icon: 'FileText'
    },
    {
      label: 'Captura de Firmas',
      path: '/digital-signature-capture',
      icon: 'PenTool'
    },
    {
      label: 'Vista Previa PDF',
      path: '/pdf-report-preview',
      icon: 'Eye',
      current: true
    }
  ];

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      {breadcrumbItems?.map((item, index) => (
        <React.Fragment key={item?.path}>
          {index > 0 && (
            <Icon 
              name="ChevronRight" 
              size={14} 
              className="text-muted-foreground" 
            />
          )}
          
          {item?.current ? (
            <div className="flex items-center space-x-1 text-foreground font-medium">
              <Icon name={item?.icon} size={14} />
              <span>{item?.label}</span>
            </div>
          ) : (
            <Link
              to={item?.path}
              className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-micro"
            >
              <Icon name={item?.icon} size={14} />
              <span>{item?.label}</span>
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNavigation;
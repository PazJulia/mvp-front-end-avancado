import { BreadCrumb } from 'primereact/breadcrumb';
import { useNavigate } from 'react-router-dom';

interface AppBreadcrumbProps {
  items: { label: string; command?: () => void }[];
}

const AppBreadcrumb = ({ items }: AppBreadcrumbProps) => {
  const navigate = useNavigate();

  const home = {
    icon: 'pi pi-home',
    command: () => navigate('/'),
  };

  return <BreadCrumb model={items} home={home} className="mb-3" />;
};

export default AppBreadcrumb;
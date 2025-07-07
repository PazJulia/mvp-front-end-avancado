import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import AppBreadcrumb from "../components/AppBreadcrumb.tsx";

const NotFound = () => {
  const navigate = useNavigate();

  const items = [
    { label: 'Erro', command: () => navigate('/not-found') }
  ];


  return (
    <div className="card">
      <AppBreadcrumb items={items} />
      <Card title="Página não encontrada" className="text-center">
        <i className="pi pi-exclamation-triangle" style={{ fontSize: '2.5rem' }}></i>
        <p className="m-0 mb-4">A página que você está tentando acessar não
          existe ou foi movida.</p>
        <Button label="Voltar para Início" icon="pi pi-arrow-left" onClick={() => navigate('/')} />
      </Card>
    </div>
  );
};

export default NotFound;

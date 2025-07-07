import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ClassificationTag from "../components/ClassificationTag.tsx";
import { useNavigate } from "react-router-dom";
import type { PacienteModel } from "../models/pacienteModel.ts";
import { Card } from "primereact/card";

const Home = () => {
  const navigate = useNavigate();
  const raw = localStorage.getItem('pacientes');
  const pacientes: PacienteModel[] = raw ? JSON.parse(raw) : [];

  const classificationBodyTemplate = (paciente: { classificacao: number; }) => {
    return <ClassificationTag classificacao={paciente.classificacao}></ClassificationTag>;
  };

  const acoesBodyTemplate = (paciente: { id: string; }) => {
    return <Button icon="pi pi-search" rounded text raised severity="help" aria-label="Favorite" tooltip="Recomendações" onClick={() => navigate(`/diagnostico/${paciente.id}`)} />
  };

  function dateToString(date: string): string {
    return date ? new Date(date).toLocaleDateString() : '';
  }

  const dataNascimentoBodyTemplate = (paciente: { dataNascimento: string }) => {
    return dateToString(paciente.dataNascimento);
  }

  const dataAtualizacaoBodyTemplate = (paciente: { dataAtualizacao: string }) => {
    return dateToString(paciente.dataAtualizacao);
  }

  return (
    <><h1>Manejo Clínico da Dengue</h1><Button severity="info" label="Cadastrar Paciente" onClick={() => navigate('/form')} />
      <Card>
        <DataTable
          value={pacientes}
          paginator rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: '50rem' }}
          emptyMessage="Nenhum paciente encontrado"
        >
          <Column field="classificacao" header="Classificação" body={classificationBodyTemplate} style={{ width: '25%' }}></Column>
          <Column field="nome" header="Nome" style={{ width: '25%' }}></Column>
          <Column field="dataNascimento" header="Data de Nascimento" body={dataNascimentoBodyTemplate} style={{ width: '25%' }}></Column>
          <Column field="dataAtualizacao" header="Data da Última Atualização" body={dataAtualizacaoBodyTemplate} style={{ width: '25%' }}></Column>
          <Column header="Ação" body={acoesBodyTemplate}></Column>
        </DataTable>
      </Card>
    </>
  )
}

export default Home;
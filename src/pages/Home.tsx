import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ClassificationTag from "../components/ClassificationTag.tsx";
import { useNavigate } from "react-router-dom";
import type { PacienteModel } from "../models/pacienteModel.ts";
import { Card } from "primereact/card";
import AppBreadcrumb from "../components/AppBreadcrumb.tsx";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import LabelWrapper from "../components/LabelWrapper.tsx";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

const Home = () => {
  const items = [
    { label: 'Pacientes', command: () => navigate('/') }
  ];

  const navigate = useNavigate();
  const raw = localStorage.getItem('pacientes');
  const allPacientes: PacienteModel[] = raw ? JSON.parse(raw) : [];

  const [search, setSearch] = useState('');
  const pacientes = allPacientes.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()));

  const classificationBodyTemplate = (paciente: { classificacao: number; }) => {
    return <ClassificationTag classificacao={paciente.classificacao}></ClassificationTag>;
  };

  const acoesBodyTemplate = (paciente: { id: string; }) => {
    return <Button icon="pi pi-search" rounded text raised severity="help" aria-label="Favorite" tooltip="Recomendações"
                   onClick={() => navigate(`/diagnostico/${paciente.id}`)}/>
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
    <>
      <AppBreadcrumb items={items}/>
      <div>
        <h2>Manejo Clínico da Dengue</h2>
        <Button severity="info" label="Cadastrar Paciente" onClick={() => navigate('/form')}/>
      </div>
      <Card className="mt-4 mb-4">
        Relato de febre, usualmente entre dois e sete dias de duração, e duas ou mais das seguintes manifestações: náusea, vômitos; exantema; mialgia, artralgia; cefaleia,
        dor retro-orbital; petéquias;
        usualmente entre dois e sete dias de duração, e sem foco de infecção aparente.
      </Card>
      <Card>
        <LabelWrapper title="Buscar Paciente">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText value={search}
                       onChange={(e) => setSearch(e.target.value)}/>
          </IconField>
        </LabelWrapper>
        <DataTable
          className="mt-8"
          value={pacientes}
          paginator rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: '50rem' }}
          emptyMessage="Nenhum paciente encontrado"
        >
          <Column field="classificacao" header="Classificação" body={classificationBodyTemplate}
                  style={{ width: '25%' }}></Column>
          <Column field="nome" header="Nome" style={{ width: '25%' }}></Column>
          <Column field="dataNascimento" header="Data de Nascimento" body={dataNascimentoBodyTemplate}
                  style={{ width: '25%' }}></Column>
          <Column field="dataAtualizacao" header="Data da Última Atualização" body={dataAtualizacaoBodyTemplate}
                  style={{ width: '25%' }}></Column>
          <Column header="Ação" body={acoesBodyTemplate}></Column>
        </DataTable>
      </Card>
    </>
  )
}

export default Home;
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ClassificationTag from "../Components/ClassificationTag.tsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const pacientes = [{ nome: "Teste C R S P", classificacao: 0, idade: 4, dataAtualizacao: new Date().toLocaleDateString() },{ nome: "Teste C R S P", classificacao: 1, idade: 4, dataAtualizacao: new Date().toLocaleDateString() }];

  const classificationBodyTemplate = (paciente: { classificacao: number; }) => {
    return <ClassificationTag classificacao={paciente.classificacao}></ClassificationTag>;

  };

  const acoesBodyTemplate = (paciente: { id: number; }) => {
    return <div></div>
  };

  return (
    <><h1>Tela inicial</h1><Button severity="info" label="Cadastrar Paciente" onClick={() => navigate('/form')} />
      <div className="card">
        <DataTable
          value={pacientes}
          paginator rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: '50rem' }}
          emptyMessage="Nenhum paciente encontrado"
        >
          <Column field="classificacao" header="Classificação" body={classificationBodyTemplate} style={{ width: '25%' }}></Column>
          <Column field="nome" header="Nome" style={{ width: '25%' }}></Column>
          <Column field="idade" header="Idade" style={{ width: '25%' }}></Column>
          <Column field="dataAtualizacao" header="Data da Última Atualização" style={{ width: '25%' }}></Column>
          <Column header="Ações" body={acoesBodyTemplate}></Column>
        </DataTable>
      </div>
    </>
  )
}

export default Home;
import { Tag } from "primereact/tag";

function ClassificationTag({classificacao}: {classificacao: number}) {
  function severityClass(classificacao: number) {
    switch (classificacao) {
      case 1:
        return "info";
      case 2:
        return "success";
      case 3:
        return "warning";
      case 4:
        return "danger";
      default:
        return undefined;
    }
  }

  function severityLabel(classificacao: number) {
    switch (classificacao) {
      case 1:
        return "Grupo A - Dengue sem sinais de alarme";
      case 2:
        return "Grupo B - Comorbidades / Risco";
      case 3:
        return "Grupo C - Sinais de Alarme";
      case 4:
        return "Grupo D - Dengue Grave";
      default:
        return "Não Classificado";
    }
  }

  return (
    <Tag rounded icon="pi pi-users" severity={severityClass(classificacao)} value={severityLabel(classificacao)}></Tag>
  )
}

export default ClassificationTag;
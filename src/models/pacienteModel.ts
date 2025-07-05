export interface PacienteModel {
  id: string;
  classificacao: number;
  nome: string;
  dataNascimento: Date;
  dataAtualizacao: Date;
  cep: string;
  endereco: string;
}
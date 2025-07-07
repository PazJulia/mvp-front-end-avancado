import { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import type { PacienteModel } from "../models/pacienteModel.ts";
import ClassificationTag from "../components/ClassificationTag.tsx";
import { useNavigate, useParams } from "react-router-dom";
import AppBreadcrumb from "../components/AppBreadcrumb.tsx";

type Etapa = 'inicio' | 'sinaisAlarme' | 'comorbidades' | 'sinaisGravidade' | 'classificacao';

interface Respostas {
  temSuspeita: boolean;
  temAlarme: boolean;
  temComorbidades: boolean;
  temGravidade: boolean;
}

const FluxoDiagnostico = () => {
  const navigate = useNavigate();

  const items = [
    { label: 'Pacientes', command: () => navigate('/') },
    { label: 'Diagnóstico' }
  ];

  const { id } = useParams();
  const [etapaAtual, setEtapaAtual] = useState<Etapa>(() => {
    const raw = localStorage.getItem('pacientes');
    const stored: PacienteModel[] = raw ? JSON.parse(raw) : [];
    const paciente = stored.find(p => p.id === id);
    return paciente?.classificacao && paciente.classificacao > 0 ? 'classificacao' : 'inicio';
  });
  const [respostas, setRespostas] = useState<Respostas>(() => {
    const raw = localStorage.getItem('pacientes');
    const stored: PacienteModel[] = raw ? JSON.parse(raw) : [];
    const paciente = stored.find(p => p.id === id);
    const grupo = paciente?.classificacao ?? 0;

    switch (grupo) {
      case 1:
        return { temSuspeita: true, temAlarme: false, temComorbidades: false, temGravidade: false };
      case 2:
        return { temSuspeita: true, temAlarme: false, temComorbidades: true, temGravidade: false };
      case 3:
        return { temSuspeita: true, temAlarme: true, temComorbidades: false, temGravidade: false };
      case 4:
        return { temSuspeita: true, temAlarme: false, temComorbidades: false, temGravidade: true };
      default:
        return { temSuspeita: false, temAlarme: false, temComorbidades: false, temGravidade: false };
    }
  });

  const responder = (pergunta: keyof Respostas, valor: boolean, proximaEtapa: Etapa) => {
    setRespostas((prev) => ({ ...prev, [pergunta]: valor }));
    setEtapaAtual(proximaEtapa);
  };

  const getClassificacao = (): PacienteModel['classificacao'] => {
    if (respostas.temGravidade) return 4;
    if (respostas.temAlarme) return 3;
    if (respostas.temComorbidades) return 2;
    if (respostas.temSuspeita) return 1;
    return 0;
  };

  function atualizarPacienteClassificacao(grupo: number) {
    const raw = localStorage.getItem('pacientes');
    const stored = raw ? JSON.parse(raw) : [];
    if (stored.length > 0) {
      const index = stored.findIndex((x: PacienteModel) => x.id === id);
      const paciente = stored[index];
      paciente.dataAtualizacao = new Date();
      paciente.classificacao = grupo;
      stored[index] = paciente;
      localStorage.setItem('pacientes', JSON.stringify(stored));
    }
  }

  const recomendacoes: Record<number, string> = {
    1: `• Hidratação oral supervisionada\n• Acompanhamento ambulatorial diário\n• Alertar sinais de alarme\n\n🔁 Reavaliar diariamente por 7 dias`,
    2: `• Observação em unidade de saúde\n• Hidratação no leito\n• Exames laboratoriais\n\n🔁 Reavaliar a cada 12 horas`,
    3: `• Internação hospitalar\n• Hidratação venosa\n• Monitoramento clínico e laboratorial rigoroso\n\n🔁 Reavaliar a cada 4 horas`,
    4: `• Internação em UTI\n• Suporte intensivo (hidrat., respiratório, renal)\n\n🔁 Monitoramento contínuo`,
    0: `Sem recomendação específica, pois não há suspeita clínica.`
  };

  const renderEtapa = () => {
    switch (etapaAtual) {
      case 'inicio':
        return (
          <Card>
            <div className="card" title="Suspeita clínica de dengue?">
              <p>Febre + pelo menos 2 sintomas (náusea, exantema, dor muscular, cefaleia etc)?</p>
              <Button label="Sim" className="mr-2" onClick={() => responder('temSuspeita', true, 'sinaisAlarme')}/>
              <Button label="Não" severity="danger" onClick={() => setEtapaAtual('classificacao')}/>
            </div>
          </Card>
        );

      case 'sinaisAlarme':
        return (
          <Card>
            <div className="card" title="Sinais de Alarme">
              <p>O paciente apresenta algum sinal de alarme (dor abdominal, vômitos persistentes, sangramento etc)?</p>
              <Button label="Sim" className="mr-2" onClick={() => responder('temAlarme', true, 'classificacao')}/>
              <Button label="Não" onClick={() => responder('temAlarme', false, 'comorbidades')}/>
            </div>
          </Card>
        );

      case 'comorbidades':
        return (
          <Card>
            <div className="card" title="Comorbidades / Condições Especiais">
              <p>O paciente possui comorbidades, menos de 2 anos, mais de 65 anos ou risco social?</p>
              <Button label="Sim" className="mr-2" onClick={() => responder('temComorbidades', true, 'classificacao')}/>
              <Button label="Não" onClick={() => responder('temComorbidades', false, 'sinaisGravidade')}/>
            </div>
          </Card>
        );

      case 'sinaisGravidade':
        return (
          <Card>
            <div title="Sinais de Gravidade">
              <p>Há sinais graves como hipotensão, extravasamento de plasma ou choque?</p>
              <Button label="Sim" className="mr-2" onClick={() => responder('temGravidade', true, 'classificacao')}/>
              <Button label="Não" onClick={() => responder('temGravidade', false, 'classificacao')}/>
            </div>
          </Card>
        );

      case 'classificacao':
        const grupo = getClassificacao();

        return (
          <Card title="Classificação Final">
            {grupo > 0 ? (
              <ClassificationTag classificacao={grupo}/>
            ) : (
              <Tag severity="secondary" value="Não há suspeita clínica de dengue"/>
            )}

            <p className="mt-8 mb-8 whitespace-pre-line">{recomendacoes[grupo]}</p>

            <div className="flex justify-content-center">
              <Button label="Reiniciar" onClick={() => {
                setRespostas({
                  temSuspeita: false,
                  temAlarme: false,
                  temComorbidades: false,
                  temGravidade: false,
                });
                setEtapaAtual('inicio');
              }}/>
              {grupo > 0 && (
                <Button
                  className="ml-2"
                  label="Salvar Paciente"
                  severity="success"
                  onClick={() => atualizarPacienteClassificacao(grupo)}
                />
              )}
            </div>
          </Card>
        );
    }
  };

  return (
    <><AppBreadcrumb items={items}></AppBreadcrumb>
      <div className="flex justify-content-center">{renderEtapa()}</div>
    </>
  );
};

export default FluxoDiagnostico;

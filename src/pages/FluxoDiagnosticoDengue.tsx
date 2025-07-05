import { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

// Tipos das etapas do fluxo
type Etapa = 'inicio' | 'sinaisAlarme' | 'comorbidades' | 'sinaisGravidade' | 'classificacao';

// Estado das respostas
interface Respostas {
  temSuspeita: boolean;
  temAlarme: boolean;
  temComorbidades: boolean;
  temGravidade: boolean;
}

const FluxoDiagnosticoDengue = () => {
  const [etapaAtual, setEtapaAtual] = useState<Etapa>('inicio');
  const [respostas, setRespostas] = useState<Respostas>({
    temSuspeita: false,
    temAlarme: false,
    temComorbidades: false,
    temGravidade: false,
  });

  const responder = (pergunta: keyof Respostas, valor: boolean, proximaEtapa: Etapa) => {
    setRespostas((prev) => ({ ...prev, [pergunta]: valor }));
    setEtapaAtual(proximaEtapa);
  };

  const renderEtapa = () => {
    switch (etapaAtual) {
      case 'inicio':
        return (
          <Card title="Suspeita clínica de dengue?">
            <p>Febre + pelo menos 2 sintomas (náusea, exantema, dor muscular, cefaleia etc)?</p>
            <Button label="Sim" className="mr-2" onClick={() => responder('temSuspeita', true, 'sinaisAlarme')} />
            <Button label="Não" severity="danger" onClick={() => setEtapaAtual('classificacao')} />
          </Card>
        );

      case 'sinaisAlarme':
        return (
          <Card title="Sinais de Alarme">
            <p>O paciente apresenta algum sinal de alarme (dor abdominal, vômitos persistentes, sangramento etc)?</p>
            <Button label="Sim" className="mr-2" onClick={() => responder('temAlarme', true, 'classificacao')} />
            <Button label="Não" onClick={() => responder('temAlarme', false, 'comorbidades')} />
          </Card>
        );

      case 'comorbidades':
        return (
          <Card title="Comorbidades / Condições Especiais">
            <p>O paciente possui comorbidades, menos de 2 anos, mais de 65 anos ou risco social?</p>
            <Button label="Sim" className="mr-2" onClick={() => responder('temComorbidades', true, 'classificacao')} />
            <Button label="Não" onClick={() => responder('temComorbidades', false, 'sinaisGravidade')} />
          </Card>
        );

      case 'sinaisGravidade':
        return (
          <Card title="Sinais de Gravidade">
            <p>Há sinais graves como hipotensão, extravasamento de plasma ou choque?</p>
            <Button label="Sim" className="mr-2" onClick={() => responder('temGravidade', true, 'classificacao')} />
            <Button label="Não" onClick={() => responder('temGravidade', false, 'classificacao')} />
          </Card>
        );

      case 'classificacao':
        return (
          <Card title="Classificação Final">
            {respostas.temGravidade ? (
              <Tag severity="danger" value="Grupo D - Dengue Grave" />
            ) : respostas.temAlarme ? (
              <Tag severity="warning" value="Grupo C - Sinais de Alarme" />
            ) : respostas.temComorbidades ? (
              <Tag severity="info" value="Grupo B - Comorbidades / Risco" />
            ) : respostas.temSuspeita ? (
              <Tag severity="success" value="Grupo A - Dengue sem sinais de alarme" />
            ) : (
              <Tag severity="secondary" value="Não há suspeita clínica de dengue" />
            )}

            <div className="mt-4">
              <Button label="Reiniciar" onClick={() => {
                setRespostas({
                  temSuspeita: false,
                  temAlarme: false,
                  temComorbidades: false,
                  temGravidade: false,
                });
                setEtapaAtual('inicio');
              }} />
            </div>
          </Card>
        );
    }
  };

  return <div className="card flex justify-content-center">{renderEtapa()}</div>;
};

export default FluxoDiagnosticoDengue;

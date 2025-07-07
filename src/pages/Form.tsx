import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputMask } from 'primereact/inputmask';
import { Button } from 'primereact/button';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import Loader from '../components/Loader';
import FormFieldWrapper from '../components/FormFieldWrapper';
import type { PacienteModel } from "../models/pacienteModel.ts";
import { Card } from 'primereact/card';

const Form = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PacienteModel>();
  const cepObserver = watch('cep');
  const [loading, setLoading] = useState(false);
  const [dadosParciais, setDadosParciais] = useState<Partial<PacienteModel>>({});

  const buscarCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;
    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const result = await response.json();
      if (!result.erro) {
        setValue('endereco', `${result.bairro} ${result.logradouro}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (values: PacienteModel) => {
    setDadosParciais({
      nome: values.nome,
      dataNascimento: values.dataNascimento,
      cep: values.cep,
      endereco: values.endereco,
    });
    salvarClassificado(values);
  };

  const salvarClassificado = (paciente: PacienteModel) => {
    const raw = localStorage.getItem('pacientes');
    const stored = raw ? JSON.parse(raw) : [];
    const novo = { ...paciente, ...dadosParciais, id: uuidv4(), dataAtualizacao: new Date() };
    localStorage.setItem('pacientes', JSON.stringify([novo, ...stored]));
    navigate(`/diagnostico/${novo.id}`);
  };

  return (
    <>
      <Card>
        <div className="grid gap-2">
          <div className="col-12 md:col-8">
            <FormFieldWrapper error={errors.nome} title="Nome">
              <InputText {...register('nome', { required: true, maxLength: 100 })}
                         className={errors.nome && 'p-invalid'}/>
            </FormFieldWrapper>
          </div>
          <div className="col-12 md:col-4">
            <FormFieldWrapper error={errors.dataNascimento} title="Data de Nascimento">
              <Calendar value={watch('dataNascimento')} {...register('dataNascimento', { required: true })}
                        className={errors.dataNascimento && 'p-invalid'} dateFormat="dd/mm/yy"/>
            </FormFieldWrapper>
          </div>
          <div className="col-12">
            <FormFieldWrapper error={errors.cep} title="CEP">
              <InputMask mask="99999-999" {...register('cep', { required: true })} className={errors.cep && 'p-invalid'}
                         placeholder="Busque o CEP" onBlur={() => buscarCep(cepObserver)}/>
            </FormFieldWrapper>
          </div>
          <div className="col-12">
            <FormFieldWrapper error={errors.endereco} title="Endereço">
              <InputText {...register('endereco', { required: true, maxLength: 100 })}
                         className={errors.endereco && 'p-invalid'}/>
            </FormFieldWrapper>
          </div>
          <div className="col-12 flex-wrap" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button outlined severity="info" label="Voltar" onClick={() => navigate('/')}/>
            <Button severity="info" label="Avançar para Diagnóstico" onClick={() => handleSubmit(onSubmit)()}/>
          </div>
        </div>
      </Card>
      <Loader show={loading}/>
    </>
  );
};

export default Form;

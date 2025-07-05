import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";
import type { PacienteModel } from "../models/pacienteModel.ts";
import FormFieldWrapper from "../components/FormFieldWrapper.tsx";
import Loader from "../components/Loader.tsx";
import { useToast } from "../context/ToastContext.tsx";
import type { ViaCepResponseModel } from "../models/viaCepResponse.model.ts";
import { v4 as uuidv4 } from 'uuid';

const Form = () => {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PacienteModel>();

  const cepObserver = watch('cep');

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const cleanCep = cepObserver?.replace(/\D/g, '');

      if (cepObserver && cleanCep.length === 8) {
        setLoading(true);

        try {
          const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
          if (!response.ok) throw new Error(`${response.status}`);
          const result: ViaCepResponseModel = await response.json();
          if (result.erro === "true") {
            showToast({
              severity: 'error',
              summary: 'Ops!',
              detail: 'Não foi possível encontrar o CEP!',
              life: 3000
            });
          } else setValue('endereco', `${result.bairro} ${result.logradouro}`);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [cepObserver]);


  const onSubmit = (values: PacienteModel): void => {
    let newValues: PacienteModel[] = [{ ...values, id: uuidv4() }];
    const raw = localStorage.getItem('pacientes');
    const storedValues: PacienteModel[] = raw ? JSON.parse(raw) : [];
    if (storedValues.length > 0) {
      newValues = [...newValues, ...storedValues];
    }
    localStorage.setItem('pacientes', JSON.stringify(newValues));
    goBack();
    showToast({
      severity: 'success',
      summary: 'Cadastro realizado!',
      detail: 'Paciente cadastrado com sucesso',
      life: 3000
    });
  }

  function goBack() {
    navigate('/');
  }

  return (
    <>
      <div className="card grid gap-2">
        <div className="col-12 md:col-8">
          <FormFieldWrapper error={errors.nome} title={'Nome'}>
            <InputText className={errors.nome && 'p-invalid'} {...register('nome', {
              required: true,
              maxLength: 100
            })} />
          </FormFieldWrapper>
        </div>

        <div className="col-12 md:col-4">
          <FormFieldWrapper error={errors.dataNascimento} title={'Data de Nascimento'}>
            <Calendar className={errors.dataNascimento && 'p-invalid'} dateFormat="dd/mm/yy"
                      value={watch('dataNascimento')} {...register('dataNascimento', { required: true })} />
          </FormFieldWrapper>
        </div>

        <div className="col-12">
          <FormFieldWrapper error={errors.cep} title={'CEP'}>
            <InputMask className={errors.cep && 'p-invalid'} mask="99999-999"
                       placeholder="Busque o CEP" {...register('cep', { required: true })} />
          </FormFieldWrapper>
        </div>

        <div className="col-12">
          <FormFieldWrapper error={errors.endereco} title={'Endereço'}>
            <InputText className={errors.endereco && 'p-invalid'} {...register('endereco', {
              required: true,
              maxLength: 100
            })} />
          </FormFieldWrapper>
        </div>

        <div className="col-12 flex-wrap" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button outlined severity="info" label="Cancelar" onClick={goBack}/>
          <Button severity="info" label="Salvar" onClick={() => handleSubmit(onSubmit)()}/>
        </div>
      </div>
      <Loader show={loading}/>
    </>

  )
}

export default Form;
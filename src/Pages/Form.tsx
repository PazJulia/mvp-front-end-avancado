import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";
import type { FormModel } from "../models/form.model.ts";
import FormFieldWrapper from "../Components/FormFieldWrapper.tsx";
import Loader from "../Components/Loader.tsx";
import { useToast } from "../context/ToastContext.tsx";
import type { ViaCepResponseModel } from "../models/viaCepResponse.model.ts";

const Form = () => {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormModel>();

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
          debugger
          if (result.erro === "true") {
            showToast({
              severity: 'error',
              summary: 'CEP não encontrado',
              detail: 'Não foi possível encontrar o CEP!',
              life: 3000
            });
          }
          else setValue('endereco', `${result.bairro} ${result.logradouro}`);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [cepObserver]);


  const onSubmit = (values: FormModel) => {
    console.log(values);

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
            <Calendar className={errors.dataNascimento && 'p-invalid'}
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
          <Button outlined severity="info" label="Cancelar" onClick={() => navigate('/')}/>
          <Button severity="info" label="Salvar" onClick={() => handleSubmit(onSubmit)()}/>
        </div>
      </div>
      <Loader show={loading}/>
    </>

  )
}

export default Form;
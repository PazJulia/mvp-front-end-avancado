import LabelWrapper from "./LabelWrapper.tsx";

function FormFieldWrapper({ title, children, error }: {
  title: string,
  children: React.ReactNode,
  error?: { type?: string; message?: string }
}) {
  return (
    <><LabelWrapper title={title}>{children}</LabelWrapper>
      <div className="flex mt-1">
        {error && (
          <small style={{ color: 'red' }}>
            {error.type == 'required' && ('Campo obrigatório')}
            {error.type == 'maxLength' && ('Limite máximo de caracteres atingido')}
          </small>
        )}
      </div>
    </>
  );
}

export default FormFieldWrapper;
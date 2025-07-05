function LabelWrapper({ title, children }: {
  title: string,
  children: React.ReactNode}) {
  return (
    <div className="label-wrapper">
      <label><strong>{title}</strong></label>
      <div style={{ width: '100%' }}>{children}</div>
    </div>
  );
}

export default LabelWrapper;
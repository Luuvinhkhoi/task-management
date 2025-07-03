import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div style={{margin:'0 auto', padding: "2rem", textAlign: "center" }}>
      <h1>404</h1>
      <p>{t('notFound.message')}</p>
    </div>
  );
};

export default NotFound;
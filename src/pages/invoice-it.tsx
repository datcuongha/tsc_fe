import { CONFIG } from 'src/config-global';

import { InvoiceItView } from 'src/sections/invoice-it/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Invoice-IT - ${CONFIG.appName}`}</title>

      <InvoiceItView />
    </>
  );
}

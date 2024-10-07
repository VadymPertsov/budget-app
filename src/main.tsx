import { App } from '@components/app'
import { createRoot } from 'react-dom/client'

import './styles/base.scss' // base styles

createRoot(document.getElementById('root')!).render(<App />)

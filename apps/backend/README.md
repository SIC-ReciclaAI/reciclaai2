# ReciclaAI Backend

API FastAPI modularizada para classificação de resíduos usando IA (MobileNetV2).

## 📚 Documentação

- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Arquitetura completa e modularização
- **API Docs**: http://localhost:4000/docs (Swagger UI)
- **ReDoc**: http://localhost:4000/redoc

## 🏗️ Estrutura Modular

```
app/
├── main.py                  # Aplicação FastAPI principal
├── config.py                # Configurações centralizadas
├── constants.py             # Dados estáticos (traduções, instruções)
├── schemas.py               # Schemas Pydantic
├── routes/                  # Rotas da API
│   ├── info.py             # /, /health, /classes
│   └── analysis.py         # /analyze-image
└── services/                # Lógica de negócio
    ├── model_service.py    # Gerenciamento do modelo
    └── image_processor.py  # Processamento de imagens
```

**Por que modular?**
- ✅ Código organizado e limpo
- ✅ Fácil manutenção e testes
- ✅ Separação de responsabilidades
- ✅ Escalável e reutilizável

## 🚀 Início Rápido

### Pré-requisitos
- Python 3.13+
- `uv` (gerenciador de pacotes Python)
- Modelo treinado: `app/models/trashnet/reciclaAI_best_model.h5`

### Instalação

```powershell
# Instalar dependências
uv pip install -e .

# Ou instalar pacotes específicos
uv pip install fastapi pillow numpy tensorflow python-multipart
```

### Executar Servidor

```powershell
# Desenvolvimento (com auto-reload)
uv run python -m uvicorn app.main:app --reload --port 4000

# Produção
uv run python -m uvicorn app.main:app --port 4000 --host 0.0.0.0
```

O servidor estará disponível em `http://localhost:4000`.
Documentação interativa: `http://localhost:4000/docs`

## 📋 Endpoints

### 1. Health Check
**GET** `/v1/health`

Verifica status da API e do modelo.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_path": "...",
  "classes": ["cardboard", "glass", "metal", "paper", "plastic", "trash"]
}
```

### 2. Analisar Imagem
**POST** `/v1/analyze-image`

Classifica um resíduo a partir de uma imagem em base64.

**Request:**
- Content-Type: `application/json`
- Body:
```json
{
  "image": "base64_string_here"
}
```

A imagem pode ser enviada como:
- Base64 puro: `"iVBORw0KGgoAAAANSUhEUgAA..."`
- Data URI: `"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."`

**Response:**
```json
{
  "success": true,
  "prediction": {
    "class": "plastic",
    "name": "Plástico",
    "category": "plástico",
    "bin_color": "vermelho",
    "confidence": 0.95,
    "confidence_percentage": "95.00%"
  },
  "instructions": [
    "Lave e remova resíduos orgânicos",
    "Remova tampas e rótulos quando possível",
    "Verifique o símbolo de reciclagem",
    "Descarte em lixeira vermelha (plástico)"
  ],
  "all_predictions": [
    {
      "class": "plastic",
      "name": "Plástico",
      "confidence": 0.95
    },
    {
      "class": "paper",
      "name": "Papel",
      "confidence": 0.03
    }
  ],
  "metadata": {
    "image_size": [1024, 768],
    "image_mode": "RGB",
    "filename": "garrafa.jpg"
  }
}
```

### 3. Listar Classes
**GET** `/v1/classes`

Retorna informações sobre todas as classes de resíduos.

**Response:**
```json
{
  "classes": [
    {
      "id": "plastic",
      "name": "Plástico",
      "category": "plástico",
      "bin_color": "vermelho",
      "instructions": ["..."]
    }
  ]
}
```

## 🧪 Testes

Execute o script de teste:

```powershell
# Teste com base64
uv run python test_base64.py
```

Ou teste manualmente com cURL:

```powershell
# Health check
curl http://localhost:4000/v1/health

# Analisar imagem (exemplo simplificado)
# 1. Converter imagem para base64
$base64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("imagem.jpg"))

# 2. Enviar para API
curl -X POST http://localhost:4000/v1/analyze-image `
  -H "Content-Type: application/json" `
  -d "{\"image\": \"$base64\"}"
```

## 🏗️ Estrutura

```
app/
├── main.py                      # Aplicação FastAPI principal
├── config.py                    # Configurações (MODEL_PATH, CORS, etc)
├── constants.py                 # Dados estáticos (CLASS_INFO)
├── schemas.py                   # Schemas Pydantic (validação)
├── routes/
│   ├── info.py                 # Rotas informativas
│   └── analysis.py             # Rotas de análise
├── services/
│   ├── model_service.py        # Gerenciamento do modelo IA
│   └── image_processor.py      # Processamento de imagens
└── models/
    └── trashnet/
        ├── pipeline_modelo.ipynb        # Notebook de treino
        ├── reciclaAI_best_model.h5     # Modelo treinado
        ├── raw_trashnet/               # Dataset original
        └── reciclaAI_dataset/          # Dataset processado
            ├── train/
            ├── val/
            └── test/
```

Veja **[ARCHITECTURE.md](./ARCHITECTURE.md)** para detalhes completos.

## 🔧 Desenvolvimento

### Treinar Modelo

1. Execute o notebook `app/models/trashnet/pipeline_modelo.ipynb`
2. O modelo será salvo em `reciclaAI_best_model.h5`
3. Reinicie o servidor para carregar o novo modelo

### CORS

CORS está configurado para aceitar requisições de `http://localhost:3000` (frontend Next.js). Para adicionar outras origens, edite `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://seu-dominio.com"],
    ...
)
```

## 📦 Dependências

- **FastAPI**: Framework web
- **TensorFlow**: Modelo de IA
- **Pillow**: Processamento de imagens
- **NumPy**: Operações numéricas
- **python-multipart**: Upload de arquivos

## 🐛 Troubleshooting

### Modelo não carregado
```
⚠ AVISO: Modelo não encontrado
```
**Solução**: Execute o notebook de treino para gerar `reciclaAI_best_model.h5`

### Erro ao processar imagem
```
Erro ao processar imagem: cannot identify image file
```
**Solução**: Verifique se o arquivo é uma imagem válida (JPEG/PNG)

### Porta em uso
```
Address already in use
```
**Solução**: Mude a porta com `--port 8000` ou encerre o processo na porta 4000

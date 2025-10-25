"""
Constantes e dados estáticos da aplicação
"""

# Traduções e instruções de descarte por classe
CLASS_INFO = {
    "cardboard": {
        "name": "Papelão",
        "category": "papel",
        "color": "azul",
        "instructions": [
            "Remova fitas adesivas e grampos",
            "Dobre ou rasgue em pedaços menores",
            "Mantenha seco e limpo",
            "Descarte em lixeira azul (papel/papelão)",
        ],
    },
    "glass": {
        "name": "Vidro",
        "category": "vidro",
        "color": "verde",
        "instructions": [
            "Lave e remova tampas e rótulos",
            "Embale vidros quebrados em jornal",
            "Não misture com cerâmica ou cristal",
            "Descarte em lixeira verde (vidro)",
        ],
    },
    "metal": {
        "name": "Metal",
        "category": "metal",
        "color": "amarelo",
        "instructions": [
            "Lave e remova resíduos",
            "Amasse latas para economizar espaço",
            "Remova componentes não metálicos",
            "Descarte em lixeira amarela (metal)",
        ],
    },
    "paper": {
        "name": "Papel",
        "category": "papel",
        "color": "azul",
        "instructions": [
            "Mantenha seco e limpo",
            "Remova plásticos e grampos",
            "Não amasse excessivamente",
            "Descarte em lixeira azul (papel/papelão)",
        ],
    },
    "plastic": {
        "name": "Plástico",
        "category": "plástico",
        "color": "vermelho",
        "instructions": [
            "Lave e remova resíduos orgânicos",
            "Remova tampas e rótulos quando possível",
            "Verifique o símbolo de reciclagem",
            "Descarte em lixeira vermelha (plástico)",
        ],
    },
    "trash": {
        "name": "Lixo não reciclável",
        "category": "orgânico/rejeito",
        "color": "cinza/preto",
        "instructions": [
            "Verifique se realmente não é reciclável",
            "Embale adequadamente resíduos orgânicos",
            "Separe materiais perigosos (pilhas, eletrônicos)",
            "Descarte em lixeira comum (cinza/preto)",
        ],
    },
}

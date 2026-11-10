#!/usr/bin/env python3
"""
Validador de Integridade do Blog Nosreme (Hugo)
Testa se o build estático gerou os arquivos necessários, se o index.json de busca
está íntegro, se o RSS/Sitemap existem e se não há links internos quebrados.
"""

import glob
import json
import os
import sys
from html.parser import HTMLParser


class LinkExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        for attr, val in attrs:
            if attr in ("href", "src") and val:
                self.links.append(val)


def main():
    public_dir = os.path.join(os.path.dirname(__file__), "..", "public")
    if not os.path.exists(public_dir):
        print(f"Erro: diretório '{public_dir}' não encontrado. Execute 'hugo' primeiro.")
        sys.exit(1)

    print("→ Iniciando validação do build estático...")

    # 1. Arquivos críticos na raiz
    required_files = [
        "index.html",
        "index.json",
        "index.xml",
        "sitemap.xml",
        "robots.txt",
        "404.html",
        "favicon.svg",
    ]
    for rf in required_files:
        path = os.path.join(public_dir, rf)
        assert os.path.exists(path), f"Arquivo obrigatório ausente: {rf}"
    print("✓ Todos os arquivos raiz (HTML, RSS, Sitemap, Robots, 404, Favicon) estão presentes.")

    # 2. Validar index.json para busca local
    json_path = os.path.join(public_dir, "index.json")
    with open(json_path, "r", encoding="utf-8") as f:
        search_data = json.load(f)
        assert isinstance(search_data, list), "index.json deve ser uma lista de artigos."
        assert len(search_data) == 2, f"Esperava exatamente 2 artigos no índice, mas encontrou {len(search_data)}."
        
        expected_titles = [
            "Fantasma na Máquina: Uma Genealogia do Reacionarismo Gamer",
            "O latino que viraliza não é o latino que existe",
        ]
        actual_titles = [item.get("title") for item in search_data]
        for exp in expected_titles:
            assert exp in actual_titles, f"Título esperado '{exp}' não encontrado nos artigos publicados: {actual_titles}"

        # Garantir ausência total de artigos de demonstração
        demo_terms = ["elogio da lentidão", "espírito do artesanato", "videogames como espaço"]
        for item in search_data:
            for dt in demo_terms:
                assert dt not in item.get("title", "").lower(), f"Artigo demonstrativo detectado: {item.get('title')}"
            for field in ["title", "permalink", "date", "summary", "content"]:
                assert field in item, f"Campo obrigatório '{field}' ausente no item {item.get('title')}"
    print(f"✓ Índice de pesquisa validado: exatamente os 2 artigos autorais publicados e zero artigos demonstrativos.")

    # 3. Validar integridade de links internos em todos os arquivos HTML
    html_files = glob.glob(os.path.join(public_dir, "**", "*.html"), recursive=True)
    broken_links = []

    for hf in html_files:
        with open(hf, "r", encoding="utf-8") as f:
            content = f.read()

        parser = LinkExtractor()
        parser.feed(content)

        for link in parser.links:
            if link.startswith(("#", "mailto:", "tel:", "http://", "https://", "javascript:")):
                continue

            clean_link = link.split("?")[0].split("#")[0]
            if not clean_link:
                continue

            if clean_link.startswith("/"):
                target_path = os.path.join(public_dir, clean_link.lstrip("/"))
            else:
                target_path = os.path.join(os.path.dirname(hf), clean_link)

            if os.path.isdir(target_path):
                target_file = os.path.join(target_path, "index.html")
            else:
                target_file = target_path

            if not (os.path.exists(target_path) or os.path.exists(target_file)):
                broken_links.append((hf, link, target_file))

    if broken_links:
        print(f"✗ Falha: {len(broken_links)} links internos quebrados encontrados:")
        for src, link, target in broken_links[:10]:
            print(f"   Em {src} -> link '{link}' (não encontrado em {target})")
        sys.exit(1)

    print(f"✓ Validação concluída em {len(html_files)} páginas HTML: zero links quebrados!")
    print("✓ Todos os testes automatizados passaram com sucesso.")


if __name__ == "__main__":
    main()

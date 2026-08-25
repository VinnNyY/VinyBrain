"""Testes locais do inventario read-only de plugins.

Nao usa navegador real e nao contem URLs ou tokens.
"""

from __future__ import annotations

import wp_plugin_inventory as inventory


class FakeTextLocator:
    def __init__(self, text: str = "", count_value: int = 0, attrs: dict[str, str] | None = None) -> None:
        self._text = text
        self._count = count_value
        self._attrs = attrs or {}

    def count(self) -> int:
        return self._count

    def nth(self, index: int):
        return self

    def inner_text(self, timeout: int = 800) -> str:
        return self._text

    def get_attribute(self, name: str, timeout: int = 800) -> str:
        return self._attrs.get(name, "")

    def locator(self, selector: str):
        return FakeTextLocator("")

    def filter(self, has_text=None):
        return self


class FakeActionLocator:
    def __init__(self, actions: list[str]) -> None:
        self.actions = actions

    def count(self) -> int:
        return len(self.actions)

    def nth(self, index: int):
        return FakeTextLocator(self.actions[index], 1)


class FakeRow:
    def __init__(self, name: str, data_plugin: str, row_class: str, version: str, actions: list[str]) -> None:
        self.name = name
        self.data_plugin = data_plugin
        self.row_class = row_class
        self.version = version
        self.actions = actions
        self.text = f"{name} Version {version} " + " ".join(actions)

    def locator(self, selector: str):
        if selector in {".plugin-title strong", "td.plugin-title strong", "th strong", "strong", "a strong"}:
            return FakeTextLocator(self.name, 1)
        if selector == ".plugin-version-author-uri":
            return FakeTextLocator(self.version, 1)
        if selector == ".plugin-version":
            return FakeTextLocator(self.version, 1)
        if selector == ".row-actions a":
            return FakeActionLocator(self.actions)
        if selector == ".row-actions":
            return FakeTextLocator("", 1 if self.actions else 0)
        if selector == ".notice":
            return FakeTextLocator("", 0)
        return FakeTextLocator("")

    def inner_text(self, timeout: int = 800) -> str:
        return self.text

    def get_attribute(self, name: str, timeout: int = 800) -> str:
        if name == "class":
            return self.row_class
        if name == "data-plugin":
            return self.data_plugin
        if name == "data-slug":
            return self.data_plugin
        return ""


class FakeRows:
    def __init__(self, rows: list[FakeRow]) -> None:
        self.rows = rows

    def count(self) -> int:
        return len(self.rows)

    def nth(self, index: int) -> FakeRow:
        return self.rows[index]


class FakePage:
    def __init__(self, rows: list[FakeRow]) -> None:
        self.url = "https://cliente.test/wp-admin/plugins.php"
        self._rows = rows

    def locator(self, selector: str):
        if selector in {"#the-list tr[data-plugin]", "#the-list tr"}:
            return FakeRows(self._rows)
        return FakeTextLocator("")


def test_exact_inventory_matching() -> None:
    page = FakePage(
        [
            FakeRow(
                name="Elementor",
                data_plugin="elementor/elementor.php",
                row_class="active",
                version="3.20.0",
                actions=["Deactivate", "Edit"],
            ),
            FakeRow(
                name="Elementor Pro",
                data_plugin="elementor-pro/elementor-pro.php",
                row_class="inactive",
                version="3.20.1",
                actions=["Activate", "Delete"],
            ),
        ]
    )

    result = inventory.inspect_requested_plugins(
        page,
        ["Elementor Pro", "WP Rocket"],
        "cliente.test",
        None,
    )

    table_rows = result["table_rows"]
    requested = result["requested"]

    assert len(table_rows) == 2
    assert table_rows[0]["data_plugin"] == "elementor/elementor.php"
    assert table_rows[1]["data_plugin"] == "elementor-pro/elementor-pro.php"

    elementor_pro = next(item for item in requested if item["plugin_name"] == "Elementor Pro")
    wp_rocket = next(item for item in requested if item["plugin_name"] == "WP Rocket")

    assert elementor_pro["installed"]
    assert elementor_pro["plugin_slug"] == "elementor-pro/elementor-pro.php"
    assert elementor_pro["active"] == "nao"
    assert elementor_pro["available_action"] == "activate"
    assert elementor_pro["activation_readiness"] == "PRONTO PARA ATIVAÇÃO ASSISTIDA"

    assert not wp_rocket["installed"]
    assert wp_rocket["activation_readiness"] == "PLUGIN NÃO INSTALADO"


def main() -> int:
    test_exact_inventory_matching()
    print("wp_plugin_inventory: ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

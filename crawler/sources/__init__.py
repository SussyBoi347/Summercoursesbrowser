from crawler.sources.base import SourceAdapter
from crawler.sources.stanford_edu import StanfordEduSource
from crawler.sources.yale_edu import YaleEduSource


def get_sources() -> dict[str, SourceAdapter]:
    adapters = [StanfordEduSource(), YaleEduSource()]
    return {adapter.name: adapter for adapter in adapters}

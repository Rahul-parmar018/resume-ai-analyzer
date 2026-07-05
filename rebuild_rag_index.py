import os
import sys

# Add resumes/utils to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "resumes"))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
import django
django.setup()

from resumes.utils.rag_engine import LocalVectorStore, DocumentProcessor

def rebuild():
    print("Initializing local Vector Store...")
    store = LocalVectorStore()
    
    print("Initializing Document Processor...")
    processor = DocumentProcessor()
    
    print("Rebuilding embeddings from knowledge base...")
    processor.process_and_index(store)
    print("Indexing status: SUCCESS!")

if __name__ == "__main__":
    rebuild()

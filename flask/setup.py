from setuptools import setup, find_packages

requires = [
        'flask',
        'flask-sqlalchemy',
        'psycopg2'
]

setup(
        name='Flaskstack',
        version='0.0',
        description='Portfolio Backend Using Flask',
        author='Drew Davies',
        keywords='flask python postgresql react',
        packages=find_packages(),
        include_package_data=True, 
        install_requires=requires
)

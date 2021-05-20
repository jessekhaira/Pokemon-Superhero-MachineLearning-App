from setuptools import setup, find_packages
import os

with open(
        os.path.join(os.path.abspath(''),
                     'ML_Model_Serving/requirements.txt')) as f:
    all_reqs = f.read()
    list_all_reqs = all_reqs.split('\n')
    list_all_reqs.pop()
    install_requires = [
        string_requirement.strip() for string_requirement in list_all_reqs
        if 'git+' not in string_requirement
    ]

print(install_requires)
setup(name='ML_Model_Serving',
      version='1.0',
      license="MIT",
      author="Jesse Khaira",
      author_email="jesse.khaira15@gmail.com",
      packages=find_packages(),
      install_requires=install_requires)

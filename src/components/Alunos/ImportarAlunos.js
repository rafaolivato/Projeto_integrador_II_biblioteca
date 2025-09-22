import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { alunosService } from '../../services/alunosService';
import './ImportarAlunos.css';

const ImportarAlunos = ({ onClose, onImportSuccess }) => {
  const [arquivo, setArquivo] = useState(null);
  const [dadosPreview, setDadosPreview] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [mapeamentoColunas, setMapeamentoColunas] = useState({
    nome: 0,    // Primeira coluna (índice 0)
    matricula: 1, // Segunda coluna (índice 1)
    turma: 2,   // Terceira coluna (índice 2)
    periodo: 3  // Quarta coluna (índice 3)
  });

  const handleArquivoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setArquivo(file);
    setResultado(null);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        // Pega as primeiras 5 linhas para preview
        const preview = jsonData.slice(0, 6).filter(row => row && row.length > 0);
        setDadosPreview(preview);
        
        // Detecta automaticamente as colunas baseado no cabeçalho
        if (preview.length > 0) {
          detectarColunas(preview[0]);
        }
        
      } catch (error) {
        console.error('Erro ao ler arquivo:', error);
        setResultado({ 
          success: false, 
          error: 'Erro ao ler arquivo Excel. Verifique o formato.' 
        });
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const detectarColunas = (cabecalho) => {
    if (!cabecalho || !Array.isArray(cabecalho)) return;

    const novoMapeamento = {};
    
    cabecalho.forEach((coluna, index) => {
      if (!coluna) return;
      
      const colunaNome = coluna.toString().toLowerCase().trim();
      
      // Remove acentos e caracteres especiais para melhor matching
      const colunaNormalizada = colunaNome
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      
      if (colunaNormalizada.includes('nome')) {
        novoMapeamento.nome = index;
      } else if (colunaNormalizada.includes('matric')) {
        novoMapeamento.matricula = index;
      } else if (colunaNormalizada.includes('turma')) {
        novoMapeamento.turma = index;
      } else if (colunaNormalizada.includes('period')) {
        novoMapeamento.periodo = index;
      }
    });

    // Se não detectou todas as colunas, usa o mapeamento padrão baseado na ordem
    if (Object.keys(novoMapeamento).length < 4) {
      setMapeamentoColunas({
        nome: 0,
        matricula: 1, 
        turma: 2,
        periodo: 3
      });
    } else {
      setMapeamentoColunas(novoMapeamento);
    }
  };

  const processarEImportar = async () => {
    if (!arquivo) return;

    setCarregando(true);
    setResultado(null);

    try {
      const data = await readExcelFile(arquivo);
      const alunosProcessados = processarDadosExcel(data);
      
      if (alunosProcessados.length === 0) {
        setResultado({ 
          success: false, 
          error: 'Nenhum aluno válido encontrado no arquivo.' 
        });
        return;
      }

      const resultadoImportacao = await importarParaSistema(alunosProcessados);
      
      setResultado(resultadoImportacao);
      
      if (resultadoImportacao.success && onImportSuccess) {
        setTimeout(() => {
          onImportSuccess();
          onClose();
        }, 2000);
      }
      
    } catch (error) {
      setResultado({ 
        success: false, 
        error: `Erro durante a importação: ${error.message}` 
      });
    } finally {
      setCarregando(false);
    }
  };

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const processarDadosExcel = (data) => {
    if (!data || data.length < 2) return [];
    
    const alunos = [];
    const cabecalho = data[0];
    
    console.log('Cabeçalho detectado:', cabecalho);
    console.log('Mapeamento sendo usado:', mapeamentoColunas);

    // Pula o cabeçalho (primeira linha) e processa os dados
    for (let i = 1; i < data.length; i++) {
      const linha = data[i];
      if (!linha || !Array.isArray(linha) || linha.length === 0) continue;

      const aluno = {
        nome: (linha[mapeamentoColunas.nome] || '').toString().trim(),
        matricula: (linha[mapeamentoColunas.matricula] || '').toString().trim(),
        turma: (linha[mapeamentoColunas.turma] || '').toString().trim(),
        periodo: (linha[mapeamentoColunas.periodo] || '').toString().trim()
      };
      
      // Validação básica - só adiciona se tiver nome e matrícula
      if (aluno.nome && aluno.matricula) {
        alunos.push(aluno);
      }
    }
    
    console.log('Alunos processados:', alunos);
    return alunos;
  };

  const importarParaSistema = async (alunos) => {
    try {
      // Para cada aluno, chama a API de criação
      const resultados = [];
      
      for (const aluno of alunos) {
        try {
          const resultado = await alunosService.criarAluno(aluno);
          resultados.push({
            aluno: aluno.nome,
            success: resultado.success,
            error: resultado.error
          });
          
          // Pequeno delay para não sobrecarregar o servidor
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          resultados.push({
            aluno: aluno.nome,
            success: false,
            error: error.message
          });
        }
      }
      
      const sucessos = resultados.filter(r => r.success).length;
      const erros = resultados.filter(r => !r.success);
      
      return {
        success: true,
        message: `✅ ${sucessos} de ${alunos.length} aluno(s) importado(s) com sucesso!`,
        total: alunos.length,
        sucessos: sucessos,
        erros: erros,
        dados: alunos
      };
      
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao importar alunos para o sistema: ' + error.message
      };
    }
  };

  return (
    <div className="importar-alunos-overlay">
      <div className="importar-alunos-modal">
        <div className="modal-header">
          <h2>📊 Importar Alunos via Excel</h2>
          <button onClick={onClose} className="btn-fechar">×</button>
        </div>

        <div className="modal-content">
          <div className="instrucoes">
            <h4>Instruções:</h4>
            <ul>
              <li>O arquivo deve ser em formato Excel (.xlsx ou .xls)</li>
              <li>Colunas esperadas: <strong>nome, matricula, turma, periodo</strong> (minúsculo)</li>
              <li>A primeira linha deve conter os cabeçalhos</li>
              <li>Formato esperado:
                <table className="formato-tabela">
                  <thead>
                    <tr>
                      <th>nome</th>
                      <th>matricula</th>
                      <th>turma</th>
                      <th>periodo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>João Silva</td>
                      <td>2023001</td>
                      <td>8º A</td>
                      <td>Manhã</td>
                    </tr>
                  </tbody>
                </table>
              </li>
            </ul>
          </div>

          <div className="upload-section">
            <label htmlFor="arquivo-excel" className="upload-label">
              📁 Selecionar Arquivo Excel
            </label>
            <input
              id="arquivo-excel"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleArquivoChange}
              disabled={carregando}
            />
            {arquivo && <span className="nome-arquivo">{arquivo.name}</span>}
          </div>

          {dadosPreview.length > 0 && (
            <div className="preview-section">
              <h4>Pré-visualização:</h4>
              <div className="preview-table">
                <table>
                  <thead>
                    <tr>
                      {dadosPreview[0]?.map((cabecalho, index) => (
                        <th key={index}>
                          {cabecalho || `Coluna ${index + 1}`}
                          {index === mapeamentoColunas.nome && ' 👤'}
                          {index === mapeamentoColunas.matricula && ' 🔢'}
                          {index === mapeamentoColunas.turma && ' 🏫'}
                          {index === mapeamentoColunas.periodo && ' ⏰'}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dadosPreview.slice(1, 4).map((linha, index) => (
                      <tr key={index}>
                        {linha.map((celula, cellIndex) => (
                          <td key={cellIndex}>{celula || '-'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>Total de linhas detectadas: {dadosPreview.length - 1}</p>
              <div className="mapeamento-info">
                <p>Mapeamento detectado:</p>
                <ul>
                  <li>👤 Nome: Coluna {mapeamentoColunas.nome + 1}</li>
                  <li>🔢 Matrícula: Coluna {mapeamentoColunas.matricula + 1}</li>
                  <li>🏫 Turma: Coluna {mapeamentoColunas.turma + 1}</li>
                  <li>⏰ Período: Coluna {mapeamentoColunas.periodo + 1}</li>
                </ul>
              </div>
            </div>
          )}

          {resultado && (
            <div className={`resultado ${resultado.success ? 'sucesso' : 'erro'}`}>
              <strong>{resultado.success ? '✅' : '❌'} {resultado.message || resultado.error}</strong>
              {resultado.erros && resultado.erros.length > 0 && (
                <div className="detalhes-erros">
                  <p>Erros encontrados:</p>
                  <ul>
                    {resultado.erros.slice(0, 3).map((erro, index) => (
                      <li key={index}>{erro.aluno}: {erro.error}</li>
                    ))}
                    {resultado.erros.length > 3 && <li>... e mais {resultado.erros.length - 3} erros</li>}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="modal-actions">
            <button onClick={onClose} className="btn-secondary" disabled={carregando}>
              Cancelar
            </button>
            <button 
              onClick={processarEImportar} 
              className="btn-primary"
              disabled={!arquivo || carregando}
            >
              {carregando ? '⏳ Importando...' : '📤 Importar Alunos'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportarAlunos;
from graphviz import Digraph

dot = Digraph('GuiaScrum', format='png')
dot.attr(rankdir='LR', size='10')

# Nodo central
dot.node('SCRUM', shape='box', style='filled', fillcolor='lightblue')

# Nivel 1
niveles = ['Fundamentos', 'Roles Scrum', 'Artefactos', 'Eventos Scrum']
for nivel in niveles:
    dot.node(nivel, shape='box')
    dot.edge('SCRUM', nivel)


# Fundamentos
dot.node('Definición', 'Definición:\nMarco ágil para resolver problemas complejos')
dot.edge('Fundamentos', 'Definición')

# Basado en
dot.node('Basado', 'Basado en')
dot.edge('Fundamentos', 'Basado')

dot.node('Empirismo', 'Empirismo')
dot.edge('Basado', 'Empirismo')

dot.node('Lean', 'Pensamiento lean')
dot.edge('Basado', 'Lean')

# Pilares
dot.node('Pilares', 'Pilares')
dot.edge('Fundamentos', 'Pilares')

dot.node('Transparencia', 'Transparencia')
dot.edge('Pilares', 'Transparencia')

dot.node('Inspección', 'Inspección')
dot.edge('Pilares', 'Inspección')

dot.node('Adaptación', 'Adaptación')
dot.edge('Pilares', 'Adaptación')

# Valores
dot.node('Valores', 'Valores')
dot.edge('Fundamentos', 'Valores')

dot.node('Compromiso', 'Compromiso')
dot.edge('Valores', 'Compromiso')

dot.node('Coraje', 'Coraje')
dot.edge('Valores', 'Coraje')

dot.node('Enfoque', 'Enfoque')
dot.edge('Valores', 'Enfoque')

dot.node('Apertura', 'Apertura')
dot.edge('Valores', 'Apertura')

dot.node('Respeto', 'Respeto')
dot.edge('Valores', 'Respeto')


# Roles
dot.node('ScrumMaster', 'Scrum Master:\nFacilita, elimina impedimentos')
dot.node('ProductOwner', 'Product Owner:\nGestiona el Product Backlog')
dot.node('Developers', 'Developers:\nCrean Incrementos de valor')
dot.edge('Roles Scrum', 'ScrumMaster')
dot.edge('Roles Scrum', 'ProductOwner')
dot.edge('Roles Scrum', 'Developers')

# Artefactos
dot.node('ProductBacklog', 'Product Backlog:\nLista ordenada de necesidades')
dot.node('SprintBacklog', 'Sprint Backlog:\nPlan del Sprint y Objetivo')
dot.node('Incremento', 'Incremento:\nResultado usable y completo')
dot.edge('Artefactos', 'ProductBacklog')
dot.edge('Artefactos', 'SprintBacklog')
dot.edge('Artefactos', 'Incremento')

# Eventos
dot.node('Sprint', 'Sprint:\nDuración máx. 1 mes')
dot.node('Planning', 'Sprint Planning:\nQué, cómo y quién')
dot.node('Daily', 'Daily Scrum:\nReunión diaria (15 min)')
dot.node('Review', 'Sprint Review:\nRevisión con stakeholders')
dot.node('Retro', 'Sprint Retrospective:\nMejora continua')
dot.edge('Eventos Scrum', 'Sprint')
dot.edge('Eventos Scrum', 'Planning')
dot.edge('Eventos Scrum', 'Daily')
dot.edge('Eventos Scrum', 'Review')
dot.edge('Eventos Scrum', 'Retro')



# Renderizar el gráfico
dot.render('guia_scrum_mindmap', view=True)

#!/bin/bash

# Script to fix remaining issues

# Base directory
TARGET_DIR="src/app/domain"

# Fix class name mismatches
echo "Fixing class name mismatches..."

# Fix CodeList
sed -i '' "s|import { Codelist } from '../models/codelist.model'|import { CodeList } from '../models/codelist.model'|g" "$TARGET_DIR/codelist/services/codelist.service.ts"

# Fix ConfigurationParameters
sed -i '' "s|import { ConfigurationParameters } from '../models/configuration-parameters.model'|import { ConfigurationParameter } from '../models/configuration-parameters.model'|g" "$TARGET_DIR/configuration/services/configuration-parameters.service.ts"

# Fix Info
sed -i '' "s|import { info } from '../models/info.model'|import { Info } from '../models/info.model'|g" "$TARGET_DIR/getInfo/services/getInfo.service.ts"

# Fix TaskUI
sed -i '' "s|import { TaskUi } from '../models/task-ui.model'|import { TaskUI } from '../models/task-ui.model'|g" "$TARGET_DIR/task/services/task-ui.service.ts"

# Fix Capabilitie
sed -i '' "s|import { capabilitie } from '../models/capabilitie.model'|import { Capabilitie } from '../models/capabilitie.model'|g" "$TARGET_DIR/capabilities/services/capabilities.service.ts"

# Fix Territory
sed -i '' "s|import { territory } from '../models/territory.model'|import { Territory } from '../models/territory.model'|g" "$TARGET_DIR/territory/services/territory-type.service.ts"

# Fix CartographySpatialSelectionParameterService
sed -i '' "s|import { cartography-parameter } from '../models/cartography-parameter.model'|import { CartographyParameter } from '../models/cartography-parameter.model'|g" "$TARGET_DIR/cartography/services/cartography-spatial-selection-parameter.service.ts"

# Fix cross-feature imports with relative paths
echo "Fixing cross-feature imports with relative paths..."

# Fix application models
sed -i '' "s|import {Background} from '../cartography/background.model'|import {Background} from '@app/domain/cartography/models/background.model'|g" "$TARGET_DIR/application/models/application-background.model.ts"
sed -i '' "s|import {Tree} from '../tree/tree.model'|import {Tree} from '@app/domain/tree/models/tree.model'|g" "$TARGET_DIR/application/models/application.model.ts"
sed -i '' "s|import {Role} from '../role/role.model'|import {Role} from '@app/domain/role/models/role.model'|g" "$TARGET_DIR/application/models/application.model.ts"
sed -i '' "s|import {CartographyGroup} from '../cartography/cartography-group.model'|import {CartographyGroup} from '@app/domain/cartography/models/cartography-group.model'|g" "$TARGET_DIR/application/models/application.model.ts"

# Fix cartography models
sed -i '' "s|import {Role} from '../role/role.model'|import {Role} from '@app/domain/role/models/role.model'|g" "$TARGET_DIR/cartography/models/cartography-group.model.ts"
sed -i '' "s|import {Service} from '../service/service.model'|import {Service} from '@app/domain/service/models/service.model'|g" "$TARGET_DIR/cartography/models/cartography.model.ts"
sed -i '' "s|import {Connection} from '../connection/connection.model'|import {Connection} from '@app/domain/connection/models/connection.model'|g" "$TARGET_DIR/cartography/models/cartography.model.ts"

# Fix service models
sed -i '' "s|import {Connection} from '../connection/connection.model'|import {Connection} from '@app/domain/connection/models/connection.model'|g" "$TARGET_DIR/service/models/service.model.ts"

# Fix tree models
sed -i '' "s|import {Cartography} from '../cartography/cartography.model'|import {Cartography} from '@app/domain/cartography/models/cartography.model'|g" "$TARGET_DIR/tree/models/tree-node.model.ts"
sed -i '' "s|import {Role} from '../role/role.model'|import {Role} from '@app/domain/role/models/role.model'|g" "$TARGET_DIR/tree/models/tree.model.ts"

echo "Remaining issues fixed!" 